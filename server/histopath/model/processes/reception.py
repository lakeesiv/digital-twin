"""Reception processes."""

from typing import TYPE_CHECKING

import salabim as sim

from ..specimens import Priority, Specimen
from .common import Batch, Batcher, DeliveryProcess, Process

if TYPE_CHECKING:
    from ..core import Model

_UNIF = sim.Uniform(0, 1).sample


def register(env: "Model"):
    """Register processes to the simulation environment."""

    env.processes["arriveReception"] = Process('arriveReception', cls=Specimen, fn=arrive_reception)
    env.processes["bookingIn"] = Process('bookingIn', cls=Specimen, fn=booking_in)

    # TODO: separate delivery processes by cut-up type?
    # Currently, we have a single delivery point for all cut-ups,
    # with sorting done as part of the cut-up stage (with assumed zero extra time)
    env.processes["receptionToCutup"] = DeliveryProcess(
        "receptionToCutup",
        resource=env.resources["Booking-in staff"],
        out_duration=env.minutes(5.0),
        return_duration=env.minutes(5.0),
        out_queue=env.processes["cutupStart"].in_queue
    )

    env.processes["batcher.receptionToCutup"] = Batcher(
        "batcher.receptionToCutup",
        batch_size=env.batch_sizes["Deliver (reception to cut-up)"],
        out_cls=Batch[Specimen],
        out_queue=env.processes["receptionToCutup"].in_queue
    )


def arrive_reception(self: Specimen):
    """Called for each new specimen arrival."""

    env: Model = self.env

    env.states["WIP"].set(env.states["WIP"]() + 1)
    env.states["inReception"].set(env.states["inReception"]() + 1)

    self.data["arrivedTime"] = env.now()
    self.data["source"] = sim.CumPdf((
        "Internal", env.globals["ProbInternal"],
        "External", 1
    )).sample()

    yield self.request((env.resources["Booking-in staff"], 1, Priority.URGENT),
                       reason="Receive and sort")
    yield self.hold(env.task_durations["Receive and sort"])
    self.release()

    self.enter_sorted(env.processes["bookingIn"].in_queue, priority=self.prio)


def booking_in(self: Specimen):
    """Book a specimen into the system."""

    env: Model = self.env

    yield self.request((env.resources["Booking-in staff"], 1, self.prio),
                       reason="Booking-in")

    # Pre-booking-in investigation
    if _UNIF() < env.globals["ProbPrebook"]:
        yield self.hold(env.task_durations["Pre-booking-in investigation"])

    # Booking-in
    yield self.hold(env.task_durations[
        "Booking-in (internal)" if self.data["source"] == "Internal" else "Booking-in (external)"
    ])

    # Additional investigation
    if self.data["source"] == "Internal":
        r = _UNIF()

        if r < env.globals["ProbInvestEasy"]:
            yield self.hold(env.task_durations["Booking-in investigation (internal easy)"])

        elif r < env.globals["ProbInvestEasy"] + env.globals["ProbInvestHard"]:
            yield self.hold(env.task_durations["Booking-in investigation (internal hard)"])

    elif _UNIF() < env.globals["ProbInvestExternal"]:
        yield self.hold(env.task_durations["Booking-in investigation (external)"])

    # Release booking-in staff
    self.release()

    # Record booked-in time and mark Reception stage as done
    self.data["bookedInTime"] = env.now()
    env.states["inReception"].set(env.states["inReception"]() - 1)

    # Batch for delivery
    if self.prio == Priority.URGENT:
        self.enter(env.processes["receptionToCutup"].in_queue)
    else:
        self.enter(env.processes["batcher.receptionToCutup"].in_queue)
