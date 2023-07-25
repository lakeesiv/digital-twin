"""Cut-up processes.

TODO: incorporate effect of cut-up specialities?
"""

from typing import TYPE_CHECKING

import salabim as sim

from ..pert import PERT
from ..specimens import Block, Priority, Specimen
from .common import Batch, Batcher, DeliveryProcess, Process

if TYPE_CHECKING:
    from ..core import Model

_UNIF = sim.Uniform(0, 1).sample


def register(env: "Model"):
    """Register processes to the simulation environment."""

    env.processes["cutupStart"] = Process("cutupStart", cls=Specimen, fn=cutup_start)
    env.processes["cutupBMS"] = Process("cutupBMS", cls=Specimen, fn=cutup_bms)
    env.processes["cutupPool"] = Process("cutupPool", cls=Specimen, fn=cutup_pool)
    env.processes["cutupLarge"] = Process("cutupLarge", cls=Specimen, fn=cutup_large)

    env.processes["cutupBMSToProcessing"] = DeliveryProcess(
        "cutupBMSToProcessing",
        resource=env.resources["BMS"],
        out_duration=env.minutes(5.0),
        return_duration=env.minutes(5.0),
        out_queue=env.processes["processingStart"].in_queue
    )
    env.processes["cutupPoolToProcessing"] = DeliveryProcess(
        "cutupPoolToProcessing",
        resource=env.resources["Cut-up assistant"],
        out_duration=env.minutes(5.0),
        return_duration=env.minutes(5.0),
        out_queue=env.processes["processingStart"].in_queue
    )
    env.processes["cutupLargeToProcessing"] = DeliveryProcess(
        "cutupLargeToProcessing",
        resource=env.resources["Cut-up assistant"],
        out_duration=env.minutes(5.0),
        return_duration=env.minutes(5.0),
        out_queue=env.processes["processingStart"].in_queue
    )

    env.processes["batcher.cutupBMSToProcessing"] = Batcher(
        "batcher.cutupBMSToProcessing",
        batch_size=env.batch_sizes["Deliver (cut-up to processing)"],
        out_cls=Batch[Specimen],
        out_queue=env.processes["cutupBMSToProcessing"].in_queue
    )
    env.processes["batcher.cutupPoolToProcessing"] = Batcher(
        "batcher.cutupPoolToProcessing",
        batch_size=env.batch_sizes["Deliver (cut-up to processing)"],
        out_cls=Batch[Specimen],
        out_queue=env.processes["cutupPoolToProcessing"].in_queue
    )
    env.processes["batcher.cutupLargeToProcessing"] = Batcher(
        "batcher.cutupLargeToProcessing",
        batch_size=env.batch_sizes["Deliver (cut-up to processing)"],
        out_cls=Batch[Specimen],
        out_queue=env.processes["cutupLargeToProcessing"].in_queue
    )


def cutup_start(self: Specimen):
    """Take specimens arriving at cut-up and sort to the correct cut-up queue."""
    env: Model = self.env

    env.states["inCutup"].set(env.states["inCutup"]() + 1)

    r = _UNIF()
    if self.prio == Priority.URGENT:
        if r < env.globals["ProbBMSCutupUrgent"]:
            cutup_type, next_process = "BMS", "cutupBMS"
        elif r < env.globals["ProbBMSCutupUrgent"]\
                + env.globals["ProbPoolCutupUrgent"]:
            cutup_type, next_process = "Pool", "cutupPool"
        else:
            cutup_type, next_process = "Large specimens", "cutupLarge"
    else:
        if r < env.globals["ProbBMSCutup"]:
            cutup_type, next_process = "BMS", "cutupBMS"
        elif r < env.globals["ProbBMSCutup"] + env.globals["ProbPoolCutup"]:
            cutup_type, next_process = "Pool", "cutupPool"
        else:
            cutup_type, next_process = "Large specimens", "cutupLarge"

    self.data["cutupType"] = cutup_type
    self.enter_sorted(env.processes[next_process].in_queue, priority=self.prio)


def cutup_bms(self: Specimen):
    """BMS cut-up. Always produces 1 small surgical block."""
    env: Model = self.env

    yield self.request((env.resources["BMS"], 1, self.prio), reason="BMS cut-up")
    yield self.hold(env.task_durations["Cut-up (BMS)"])
    block = Block(name=f"{self.name()}.", parent=self, block_type="small surgical")
    self.blocks.append(block)
    self.data["numBlocks"] = len(self.blocks)
    self.data["cutupTime"] = env.now()
    self.release()

    env.states["inCutup"].set(env.states["inCutup"]() - 1)

    if self.prio == Priority.URGENT:
        self.enter(env.processes["cutupBMSToProcessing"].in_queue)
    else:
        self.enter(env.processes["batcher.cutupBMSToProcessing"].in_queue)


def cutup_pool(self: Specimen):
    """Pool cut-up. Always produces 1 large surgical block."""
    env: Model = self.env

    yield self.request((env.resources["Cut-up assistant"], 1, self.prio), reason="Pool cut-up")
    yield self.hold(env.task_durations["Cut-up (pool)"])
    block = Block(name=f"{self.name()}.", parent=self, block_type="large surgical")
    self.blocks.append(block)
    self.data["numBlocks"] = len(self.blocks)
    self.data["cutupTime"] = env.now()
    self.release()

    env.states["inCutup"].set(env.states["inCutup"]() - 1)

    if self.prio == Priority.URGENT:
        self.enter(env.processes["cutupPoolToProcessing"].in_queue)
    else:
        self.enter(env.processes["batcher.cutupPoolToProcessing"].in_queue)


def cutup_large(self: Specimen):
    """Large cut-up. Produces a random number of mega or large surgical blocks."""
    env: Model = self.env

    yield self.request((env.resources["Cut-up assistant"], 1, self.prio), reason="Large cut-up")
    yield self.hold(env.task_durations["Cut-up (large specimens)"])

    # Urgent blocks are never megas.
    # TODO: let user choose n_blocks distribution in config file.
    if (self.prio == Priority.URGENT) or (_UNIF() < env.globals["ProbMegaBlocks"]):
        n_blocks = round(PERT(*(env.globals["NumBlocksMega"][[0, 2, 1]])).sample())
        block_type = "mega"
    else:
        n_blocks = round(PERT(*(env.globals["NumBlocksLargeSurgical"][[0, 2, 1]])).sample())
        block_type = "large surgical"

    for _ in range(n_blocks):
        block = Block(name=f"{self.name()}.", parent=self, block_type=block_type)
        self.blocks.append(block)

    self.data["numBlocks"] = len(self.blocks)
    self.data["cutupTime"] = env.now()
    self.release()

    env.states["inCutup"].set(env.states["inCutup"]() - 1)

    if self.prio == Priority.URGENT:
        self.enter(env.processes["cutupLargeToProcessing"].in_queue)
    else:
        self.enter(env.processes["batcher.cutupLargeToProcessing"].in_queue)
