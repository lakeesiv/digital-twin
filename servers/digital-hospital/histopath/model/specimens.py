"""Defines specimens, blocks, and slides."""
import enum
from typing import TYPE_CHECKING,  Generic, TypeVar

import salabim as sim

if TYPE_CHECKING:
    from model import Model


class Priority(enum.IntEnum):
    """Specimen priority. Lower value = higher priority."""
    ROUTINE = 0
    CANCER = -1
    PRIORITY = -2
    URGENT = -3


def priority_color(prio: Priority):
    """Map each possible value in the `Priority` `enum` to a color."""
    return (
        'red' if prio == Priority.URGENT
        else 'orange' if prio == Priority.PRIORITY
        else 'green' if prio == Priority.CANCER
        else 'fg'
    )


class Specimen(sim.Component):
    """A tissue specimen.

    Attributes:
        data (dict):
            Dictionary of specimen attributes, e.g. timestamps.
        blocks (list):
            A list of blocks produced from the specimen during cut-up.
        request_reason (str):
            Reason for the last request(), or the empty string if no resource
            has been requested yet.
        prio (Priority):
            The priority of the specimen.
    """

    def setup(self, **kwargs):
        env: Model = self.env

        self.data = kwargs
        self.blocks: list["Block"] = []
        self.request_reason = ""

        dist = "Cancer" if self.data["cancer"] else "NonCancer"
        cdf = sim.CumPdf((
            Priority.URGENT,
            env.globals[f"ProbUrgent{dist}"],

            Priority.PRIORITY,
            env.globals[f"ProbUrgent{dist}"] + env.globals[f"ProbPriority{dist}"],

            (Priority.CANCER if dist == "Cancer" else Priority.ROUTINE),
            1
        ))
        self.prio: Priority = cdf.sample()

        # Add the priority to `self.data` so that it appears in the specimen log.
        self.data["priority"] = self.prio.name

    def process(self):
        """Insert specimen into the `inQueue` of its first `Process`."""
        env: Model = self.env
        self.enter(env.processes["arriveReception"].in_queue)

    def request(self, *args, reason="", **kwargs):
        """Request resouces.

        Args:
            *args (Resource | list):
                A Resource, or a list of (Resource, quantity, priority) tuples.
            reason (str, optional):
                A string describing why the resource(s) are being requested. Defaults to "".
        """
        self.request_reason = reason
        super().request(*args, **kwargs)

    def animation_objects(self):
        """Defines how to animate the Specimen (if animation is enabled).

        Displays a text string with a (0,16) offset.

        Returns:
            tuple: The x and y offset of the AnimateText object, and the object itself.
        """
        ao0 = sim.AnimateText(text=lambda: f"{self.name()} [{self.request_reason}]",
                              textcolor=lambda: priority_color(self.prio),
                              text_anchor='nw')
        return 0, 16, ao0


class Block(sim.Component):
    """A wax block.

    Attributes:
        data (dict):
            Dictionary of block attributes, e.g. timestamps.
        parent (Specimen):
            The specimen that this block belongs to.
        slides (list):
            A list of slides produced from the block during microtomy.
        request_reason (str):
            Reason for the last request(), or the empty string if no resource
            has been requested yet.
        prio (Priority):
            The priority of the block. Inherited from that of the parent specimen.
    """

    def setup(self, *, parent: Specimen, **kwargs):
        self.data = kwargs
        self.parent = parent
        self.prio = parent.prio
        self.slides: list["Slide"] = []
        self.request_reason = ""

    def request(self, *args, reason="", **kwargs):
        """Request resouces.

        Args:
            *args (Resource | list):
                A Resource, or a list of (Resource, quantity, priority) tuples.
            reason (str, optional):
                A string describing why the resource(s) are being requested. Defaults to "".
        """
        self.request_reason = reason
        super().request(*args, **kwargs)

    def animation_objects(self):
        """Defines how to animate the Block (if animation is enabled).

        Displays a text string with a (0,16) offset.

        Returns:
            tuple: The x and y offset of the AnimateText object, and the object itself.
        """
        ao0 = sim.AnimateText(text=lambda: f"{self.name()} [{self.request_reason}]",
                              textcolor=lambda: priority_color(self.prio),
                              text_anchor='nw')
        return 0, 16, ao0


class Slide(sim.Component):
    """A glass slide.

    Attributes:
        data (dict):
            Dictionary of slide attributes, e.g. timestamps.
        parent (Block):
            The block that this slide belongs to.
        request_reason (str):
            Reason for the last request(), or the empty string if no resource
            has been requested yet.
        prio (Priority):
            The priority of the slide. Inherited from that of the parent block.
    """

    def setup(self, *, parent: Block, **kwargs):
        self.data = kwargs
        self.parent = parent
        self.prio = parent.prio
        self.request_reason = ""

    def request(self, *args, reason="", **kwargs):
        """Request resouces.

        Args:
            *args (Resource | list):
                A Resource, or a list of (Resource, quantity, priority) tuples.
            reason (str, optional):
                A string describing why the resource(s) are being requested. Defaults to "".
        """
        self.request_reason = reason
        super().request(*args, **kwargs)

    def animation_objects(self):
        """Defines how to animate the Slide (if animation is enabled).

        Displays a text string with a (0,16) offset.

        Returns:
            tuple: The x and y offset of the AnimateText object, and the object itself.
        """
        ao0 = sim.AnimateText(text=lambda: f"{self.name()} [{self.request_reason}]",
                              textcolor=lambda: priority_color(self.prio),
                              text_anchor='nw')
        return 0, 16, ao0


T = TypeVar('T')


class Batch(sim.Component, Generic[T]):
    """A batch of specimens, for delivery between histopathology stages."""

    def setup(self, **kwargs):
        self.data = kwargs
        self.items: list[T] = []  # Initialise as empty
        self.request_reason = ""
    
    def request(self, *args, reason="", **kwargs):
        """Request resouces.

        Args:
            *args (Resource | list):
                A Resource, or a list of (Resource, quantity, priority) tuples.
            reason (str, optional):
                A string describing why the resource(s) are being requested. Defaults to "".
        """
        self.request_reason = reason
        super().request(*args, **kwargs)

    def animation_objects(self):
        """Defines how to animate the Batch (if animation is enabled).

        Displays a text string with a (0,16) offset.

        Returns:
            tuple: The x and y offset of the AnimateText object, and the object itself.
        """
        ao0 = sim.AnimateText(text=lambda: f"{self.name()} [{self.request_reason}]",
                              text_anchor='nw')
        return 0, 16, ao0
