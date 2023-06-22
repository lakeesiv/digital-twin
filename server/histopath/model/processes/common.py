"""Core process definitions."""
import itertools
from collections.abc import Callable, Sequence
from typing import Any, Type, Union

import salabim as sim
from salabim.salabim import Environment

from ..specimens import Batch, Priority, Specimen


class Process(sim.Component):
    """Defines a process that takes entities from an in-queue.
    For each entity, the function with the same name as the `Process`
    is invoked.

    The function should be defined in the global scope and is
    registered to the class `cls` upon initialisation of the `Process`.

    Attributes:
        name (str):
            Name of the process to invoke. Must be a valid function name.
        cls:
            Class of the entity that the process handles
        in_queue (sim.Store):
            The queue from which entities are taken. These entities should be of type `cls`.
    """

    def setup(self, *, cls: Type[sim.Component], fn: Callable):
        """Initialise the process.

        Args:
            cls (Type[sim.Component]): Class of the entity that the process handles.
            fn (Callable): Function to be invoked for each entity taken from the process' in-queue.
        """
        # Create an input queue for the process.
        self.cls = cls
        self.in_queue = sim.Store(f'{self.name()}.inQueue')

        # Register `fn` to class `cls` using `self.name()`.
        setattr(cls, self.name(), fn)

    def process(self):
        """The process loop."""

        while True:
            entity: Type[sim.Component] = yield self.from_store(self.in_queue)
            entity.activate(process=self.name())


class Batcher(sim.Component):
    """Takes `batchSize` entities from `inQueue` and insert them into `outQueue` as
    a single instance of `cls`. The `cls` class must contain an attribute `items` (a list).

    Attributes:
        batchSize (int): The batch size
        out_cls (Type[sim.Component]): The class of the batched component.
        in_queue (sim.Store): Queue to take entities from.
        out_queue (sim.Store): Queue to insert the batch into.
        batch_args (dict): Dictionary of attributes to assign to the batch.
    """

    def setup(self, *, batch_size: Union[int, sim.Distribution],
              out_cls: Type[sim.Component], out_queue: sim.Store, **batch_args):
        """Initialise the batcher.

        Args:
            batch_size (Union[int, sim.Distribution]):
                The batch size, or a distribution generating the batch size.
            out_cls (Type[sim.Component]): The class of the batched component.
            out_queue (sim.Store): Queue to insert the batch into.
            batch_args (dict): Dictionary of attributes to assign to the batch.
        """
        self.batch_size = batch_size
        self.out_cls = out_cls
        self.in_queue = sim.Store(f'{self.name()}.inQueue')
        self.out_queue = out_queue
        self.batch_args = batch_args  # pass-through arguments

    def process(self):
        """The batching loop."""
        while True:
            batch_size = self.batch_size() if callable(self.batch_size) else self.batch_size
            batch = self.out_cls(**self.batch_args)  # Initialise empty batch
            for _ in range(batch_size):
                item: sim.Component = yield self.from_store(self.in_queue)
                item.register(batch.items)  # add to batch
            batch.enter(self.out_queue)


class Collator(sim.Component):
    """Takes entities from `inQueue` and places into a pool. Once all
    entities with the same parent are found (checked using `counterName`),
    the parent entity is added to `outQueue`.

    Attributes:
        counter_name (str):
            Name of the counter in the parent class to determine if all entities have been collated.
        in_queue (sim.Store):
            Queue to take entities from.
        out_queue (sim.Store):
            Queue to insert the parent entity into when collation is complete.
        dict (dict):
            Stores components using
    """

    def setup(self, *, counter_name: str, out_queue: sim.Store):
        """Initialise the collator.

        Args:
            counter_name (str):
                Name of the counter in the parent class to determine if all entities
                have been collated.
            out_queue (sim.Store):
                Queue to insert the parent entity into when collation is complete.
        """
        self.counter_name = counter_name
        self.in_queue = sim.Store(f'{self.name()}.inQueue')
        self.out_queue = out_queue
        self.dict: dict[str, list[sim.Component]] = {}

    def process(self):
        """The collation loop."""
        while True:
            item: sim.Component = yield self.from_store(self.in_queue)
            if item.parent.name() not in self.dict:
                self.dict[item.parent.name()] = []
            self.dict[item.parent.name()].append(item)

            # Check item.parent.{counterName} to see if we have collected all items in the group
            if len(self.dict[item.parent.name()]) == item.parent.data[self.counter_name]:
                item.parent.enter(self.out_queue)
                del self.dict[item.parent.name()]


class DeliveryProcess(sim.Component):
    """A delivery process.

    Attributes:
        resource (sim.Resource): The resource responsible for the delivery.
        out_duration (sim.Distribution): The travel time to the destination.
        return_duration (sim.Distribution):
            The travel time from the destination back to the origin station.
        in_queue (sim.Store):
            Queue to take entities (specimen or batches of specimens) from.
        out_queue (sim.Store):
            Queue to insert delivered `Specimens`.
    """

    def setup(self, *, resource: sim.Resource,
              out_duration: sim.Distribution,
              return_duration: sim.Distribution,
              out_queue: sim.Store):
        """Initialise the delivery process.

        Args:
            resource (sim.Resource):
                The resource responsible for the delivery.
            out_duration (sim.Distribution):
                The travel time to the destination.
            return_duration (sim.Distribution):
                The travel time from the destination back to the origin station.
            out_queue (sim.Store):
                Queue to insert delivered `Specimens`.
        """
        self.in_queue = sim.Store(f'{self.name()}.inQueue')
        self.resource = resource
        self.out_duration = out_duration
        self.return_duration = return_duration
        self.out_queue = out_queue

    def process(self):
        """The delivery loop. Batches of specimens are automatically unbatched at arrival."""
        while True:

            specimen_or_batch: Union[Specimen, Batch[Specimen]]\
                = yield self.from_store(self.in_queue)

            # Request runner. Note that it is the active process that requests the runner
            # and not `specimen_or_batch`.
            prio = (
                Priority.URGENT if not isinstance(specimen_or_batch, Batch)
                and specimen_or_batch.prio == Priority.URGENT
                else Priority.ROUTINE
            )
            yield self.request((self.resource, 1, prio))

            # Outward journey
            yield self.hold(self.out_duration)

            # Add specimen(s) to `out_queue`, unbatching if needed
            if isinstance(specimen_or_batch, Batch):
                for specimen in specimen_or_batch.items:
                    specimen.enter_sorted(self.out_queue, priority=specimen.prio)
            else:
                specimen_or_batch.enter_sorted(self.out_queue, priority=specimen_or_batch.prio)

            # Return journey
            yield self.hold(self.return_duration)

            # Release runner
            self.release()

    def animation_objects(self):
        """Defines how to animate the delivery task (if animation is enabled).

        Displays a text string with a (0,16) offset.

        Returns:
            tuple: The x and y offset of the AnimateText object, and the object itself.
        """
        ao0 = sim.AnimateText(text=self.name(), textcolor='purple', text_anchor='nw')
        return 0, 16, ao0


class TimeVaryingGenerator(sim.Component):
    """Generates Components according to a time-varying Poisson process.

    Attributes:
        cls (Type[sim.Component]): The subclass of `Component` to create.
        iterator (Iterable): A cycle of (duration, rate) pairs.
        cls_args: arguments passed to the constructor of `cls`.
    """

    def setup(self, *, cls: Type[sim.Component],
              durations: Sequence[float], rates: Sequence[float],
              **cls_args):
        """Initialise the generator.

        Args:
            cls (Type[sim.Component]): The subclass of `Component` to create.
            durations (Sequence[float]): The durations of each interval in the arrival schedule.
            rates (Sequence[float]): The arrival rates for each interval in the schedule.
            cls_args: arguments passed to the constructor of `cls`.
        """
        self.cls = cls
        self.iterator = itertools.cycle(zip(durations, rates))
        self.cls_args = cls_args

    def process(self):
        """The generator process; create a subgenerator for each interval in the schedule."""
        for duration, rate in self.iterator:
            if rate > 0:
                # Start a generator at the current simulation time
                sim.ComponentGenerator(
                    self.cls, duration=duration, iat=sim.Exponential(rate=rate), **self.cls_args)
            yield self.hold(duration)


class ResourceScheduler(sim.Component):
    """Changes the capacity of a resource based on a schedule.

    Attributes:
        resource (sim.Resource): The resource to change the capacity of.
        iterator (Iterable): A cycle of (duration, capacity) pairs.

    """

    def setup(self, *, resource: sim.Resource,
              durations: Sequence[float], capacities: Sequence[int]):
        """Initialise the scheduler,

        Args:
            resource (sim.Resource): The resource to change the capacity of.
            durations (Sequence[float]): The durations of each interval in the resource schedule.
            capacities (Sequence[int]): The resource capacity for each interval in the schedule.
        """
        self.resource = resource
        self.iterator = itertools.cycle(zip(durations, capacities))

    def process(self):
        """Change the resource capacity at the start of each interval."""
        for duration, capacity in self.iterator:
            old_capacity = self.resource.capacity()
            if capacity != old_capacity:
                self.resource.set_capacity(capacity)
            yield self.hold(duration)


class Signal(sim.State):
    """Wrapper class around `sim.State` to act as a signal.
    Changes the defaults of the constructor.

    Calling `trigger()` without arguments will set the signal to True,
    honour all matching wait() requests, then immediately set the signal back to False."""
    # pylint: disable=keyword-arg-before-vararg, redefined-builtin

    def __init__(self, name: str = None, value: Any = False,
                 type: str = "bool", monitor: bool = False, env: Environment = None,
                 *args, **kwargs):
        super().__init__(name, value, type, monitor, env, *args, **kwargs)
