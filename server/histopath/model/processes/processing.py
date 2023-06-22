"""Tissue processing processes.

TODO: incorporate signals as gates for processing start times?
Handle weekends as special case?
"""

from typing import TYPE_CHECKING

import salabim as sim

from ..specimens import Block, Priority, Specimen
from .common import Batch, Batcher, Collator, DeliveryProcess, Process

if TYPE_CHECKING:
    from ..core import Model

_UNIF = sim.Uniform(0, 1).sample


def register(env: "Model"):
    """Register processes to the simulation environment."""

    env.processes["processingStart"] = Process(
        "processingStart", cls=Specimen, fn=processing_start)
    env.processes["processingAssignQueue"] = Process(
        "processingAssignQueue", cls=Block, fn=processing_assign_queue)

    env.processes["decalcBoneStation"] = Process(
        "decalcBoneStation", cls=Batch[Block], fn=decalc_bone_station
    )  # decalc: bone marrow samples
    env.processes["decalcOven"] = Process(
        "decalcOven", cls=Block, fn=decalc_oven)  # decalc: other calcified samples

    env.processes["processingUrgent"] = Process(
        "processingUrgent", cls=Batch[Block], fn=processing_urgent)  # urgent blocks
    env.processes["processingSmalls"] = Process(
        "processingSmalls", cls=Batch[Block], fn=processing_smalls)  # small surgical blocks
    env.processes["processingLarges"] = Process(
        "processingLarges", cls=Batch[Block], fn=processing_larges)  # large surgical blocks
    env.processes["processingMegas"] = Process(
        "processingMegas", cls=Batch[Block], fn=processing_megas)  # mega blocks
    
    env.processes["embedAndTrim"] = Process(
        "embedAndTrim", cls=Block, fn=embed_and_trim)
    env.processes["postProcessing"] = Process(
        "postProcessing", cls=Specimen, fn=post_processing)
    
    env.processes["processingToMicrotomy"] = DeliveryProcess(
        "processingToMicrotomy",
        resource=env.resources["Processing room staff"],
        out_duration=env.minutes(5.0),
        return_duration=env.minutes(5.0),
        out_queue=env.processes["microtomy"].in_queue
    )

    env.processes["batcher.decalcBoneStation"] = Batcher(
        "batcher.decalcBoneStation",
        batch_size=env.batch_sizes["Bone station"],
        out_cls=Batch[Block],
        out_queue=env.processes["decalcBoneStation"].in_queue
    )
    env.processes["batcher.processingUrgent"] = Batcher(
        "batcher.processingUrgent",
        batch_size=env.batch_sizes["Processing (regular)"],  # TODO: reduced batch size for urgent?
        out_cls=Batch[Block],
        out_queue=env.processes["processingUrgent"].in_queue
    )
    env.processes["batcher.processingSmalls"] = Batcher(
        "batcher.processingSmalls",
        batch_size=env.batch_sizes["Processing (regular)"],
        out_cls=Batch[Block],
        out_queue=env.processes["processingSmalls"].in_queue
    )
    env.processes["batcher.processingLarges"] = Batcher(
        "batcher.processingLarges",
        batch_size=env.batch_sizes["Processing (regular)"],
        out_cls=Batch[Block],
        out_queue=env.processes["processingLarges"].in_queue
    )
    env.processes["batcher.processingMegas"] = Batcher(
        "batcher.processingMegas",
        batch_size=env.batch_sizes["Processing (megas)"],
        out_cls=Batch[Block],
        out_queue=env.processes["processingMegas"].in_queue
    )

    # Collate processed blocks and forward to delivery batcher
    # blocks -> specimens -> delivery batches
    env.processes["batcher.processingToMicrotomy"] = Batcher(
        "batcher.processingToMicrotomy",
        batch_size=env.batch_sizes["Deliver (processing to microtomy)"],
        out_cls=Batch[Specimen],
        out_queue=env.processes["processingToMicrotomy"].in_queue
    )
    env.processes["collate.postProcessing"] = Collator(
        "collate.postProcessing",
        counter_name="numBlocks",
        out_queue=env.processes["postProcessing"].in_queue
    )

def processing_start(self: Specimen):
    """Take specimens arriving a processing and send to decalc if necessary.
    Else, send to queue assignment."""
    env: Model = self.env

    env.states["inProcessing"].set(env.states["inProcessing"]() + 1)

    r = _UNIF()
    if r < env.globals["ProbDecalcBone"]:
        self.data["decalcType"] = "bone station"
        out_queue = env.processes["batcher.decalcBoneStation"].in_queue
    elif r < env.globals["ProbDecalcBone"] + env.globals["ProbDecalcOven"]:
        self.data["decalcType"] = "decalc oven"
        out_queue = env.processes["decalcOven"].in_queue
    else:
        out_queue = env.processes["processingAssignQueue"].in_queue
    
    for block in self.blocks:
        block.enter_sorted(out_queue, priority=self.prio)

def processing_assign_queue(self: Block):
    """Assign incoming blocks to the correct Batcher process,
    according to type."""
    env: Model = self.env

    if self.prio == Priority.URGENT:
        out_queue = env.processes["batcher.processingUrgent"].in_queue
    if self.data["block_type"] == "small surgical":
        out_queue = env.processes["batcher.processingSmalls"].in_queue
    if self.data["block_type"] == "large surgical":
        out_queue = env.processes["batcher.processingLarges"].in_queue
    else:
        out_queue = env.processes["batcher.processingMegas"].in_queue
    
    self.enter_sorted(out_queue, self.prio)

def decalc_bone_station(self: Batch[Block]):
    """Decalc a batch of blocks in a bone station."""
    env: Model = self.env

    # Load machine
    yield self.request((env.resources["BMS"], 1), (env.resources["Bone station"], 1))
    yield self.hold(env.task_durations["Load bone station"])
    self.release(env.resources["BMS"])

    # Decalc
    yield self.hold(env.task_durations["Decalc"])

    # Unload machine
    yield self.request((env.resources["BMS"],1))
    yield self.hold(env.task_durations["Unload bone station"])
    self.release()  # release all

    for block in self.items:
        block.enter_sorted(env.processes["processingAssignQueue"].in_queue, block.prio)

def decalc_oven(self: Block):
    """Decalc a batch of blocks in a bone station."""
    env: Model = self.env

    # Load machine
    yield self.request((env.resources["BMS"], 1))
    yield self.hold(env.task_durations["Load into decalc oven"])
    self.release(env.resources["BMS"])

    # Decalc
    yield self.hold(env.task_durations["Decalc"])

    # Unload machine
    yield self.request((env.resources["BMS"],1))
    yield self.hold(env.task_durations["Unload from decalc oven"])
    self.release()  # release all

    self.enter_sorted(env.processes["processingAssignQueue"].in_queue, self.prio)

def processing_urgent(self: Batch[Block]):
    """Processing machine for urgent blocks."""
    env: Model = self.env

    # Load machine
    yield self.request(
        (env.resources["Processing room staff"], 1, Priority.URGENT),
        (env.resources["Processing machine"], 1, Priority.URGENT),
        reason="Processing (urgent)"
    )
    yield self.hold(env.task_durations["Load processing machine"])
    self.release(env.resources["Processing room staff"])

    # Processing
    yield self.hold(env.task_durations["Processing (urgent)"])

    # Unload machine
    yield self.request((env.resources["Processing room staff"],1),
                       reason="Unload processing machine")
    yield self.hold(env.task_durations["Unload processing machine"])
    self.release()  # release all

    for block in self.items:
        block.enter_sorted(env.processes["embedAndTrim"].in_queue, block.prio)

def processing_smalls(self: Batch[Block]):
    """Processing machine for small surgical blocks."""
    env: Model = self.env

    # Load machine
    yield self.request(
        (env.resources["Processing room staff"], 1),
        (env.resources["Processing machine"], 1),
        reason="Processing (smalls)"
    )
    yield self.hold(env.task_durations["Load processing machine"])
    self.release(env.resources["Processing room staff"])

    # Processing
    yield self.hold(env.task_durations["Processing (small surgicals)"])

    # Unload machine
    yield self.request((env.resources["Processing room staff"],1),
                       reason="Unload processing machine")
    yield self.hold(env.task_durations["Unload processing machine"])
    self.release()  # release all

    for block in self.items:
        block.enter_sorted(env.processes["embedAndTrim"].in_queue, block.prio)

def processing_larges(self: Batch[Block]):
    """Processing machine for large surgical blocks."""
    env: Model = self.env

    # Load machine
    yield self.request(
        (env.resources["Processing room staff"], 1),
        (env.resources["Processing machine"], 1),
        reason="Processing (larges)"
    )
    yield self.hold(env.task_durations["Load processing machine"])
    self.release(env.resources["Processing room staff"])

    # Processing
    yield self.hold(env.task_durations["Processing (large surgicals)"])

    # Unload machine
    yield self.request((env.resources["Processing room staff"],1),
                       reason="Unload processing machine")
    yield self.hold(env.task_durations["Unload processing machine"])
    self.release()  # release all

    for block in self.items:
        block.enter_sorted(env.processes["embedAndTrim"].in_queue, block.prio)

def processing_megas(self: Batch[Block]):
    """Processing machine for mega blocks."""
    env: Model = self.env

    # Load machine
    yield self.request(
        (env.resources["Processing room staff"], 1),
        (env.resources["Processing machine"], 1),
        reason="Processing (megas)"
    )
    yield self.hold(env.task_durations["Load processing machine"])
    self.release(env.resources["Processing room staff"])

    # Processing
    yield self.hold(env.task_durations["Processing (megas)"])

    # Unload machine
    yield self.request((env.resources["Processing room staff"],1),
                       reason="Unload processing machine")
    yield self.hold(env.task_durations["Unload processing machine"])
    self.release()  # release all

    for block in self.items:
        block.enter_sorted(env.processes["embedAndTrim"].in_queue, block.prio)

def embed_and_trim(self: Block):
    """Embed blocks in wax and trim the excess."""
    env: Model = self.env

    # Embedding
    yield self.request(
        (env.resources["Processing room staff"], 1),
        reason="Embedding"
    )
    yield self.hold(env.task_durations["Embedding"])
    self.release(env.resources["Processing room staff"])

    # Cooldown (unstaffed)
    yield self.hold(env.task_durations["Embedding (cooldown)"])

    # Trimming
    yield self.request((env.resources["Processing room staff"],1), reason="Trimming")
    yield self.hold(env.task_durations["Block trimming"])
    self.release()  # release all

    self.enter_sorted(env.processes["collate.postProcessing"].in_queue, self.prio)

def post_processing(self: Specimen):
    """Post-processing tasks."""
    env: Model = self.env

    env.states["inProcessing"].set(env.states["inProcessing"]() - 1)
    self.data["processedTime"] = env.now()
    self.enter_sorted(env.processes["batcher.processingToMicrotomy"].in_queue, self.prio)