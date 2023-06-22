"""Staining processes."""

from typing import TYPE_CHECKING

import salabim as sim

from ..pert import PERT
from ..specimens import Block, Priority, Specimen, Slide
from .common import Batch, Batcher, Collator, DeliveryProcess, Process

if TYPE_CHECKING:
    from ..core import Model

_UNIF = sim.Uniform(0, 1).sample


def register(env: "Model"):
    """Register processes to the simulation environment."""
    env.processes["stainingStart"] = Process(
        "stainingStart", cls=Specimen, fn=staining_start)
    env.processes["stainingRegular"] = Process(
        "stainingRegular", cls=Batch[Slide], fn=staining_regular)
    env.processes["stainingMegas"] = Process(
        "stainingMegas", cls=Batch[Slide], fn=staining_megas)
    
    # MACHINE BATCHING
    env.processes["batcher.stainingRegular"] = Batcher(
        "batcher.stainingRegular",
        batch_size=env.batch_sizes["Staining (regular)"],
        out_cls=Batch[Slide],
        out_queue=env.processes["stainingRegular"].in_queue
    )
    env.processes["batcher.stainingMegas"] = Batcher(
        "batcher.stainingMegas",
        batch_size=env.batch_sizes["Staining (megas)"],
        out_cls=Batch[Slide],
        out_queue=env.processes["stainingMegas"].in_queue
    )

    # MACHINE COLLATION AND POST-STAINING
    env.processes["postStaining"] = Process(
        "postStaining", cls=Specimen, fn=post_staining)
    env.processes["collate.postStaining2"] = Collator(  # Blocks -> Specimens
        "collate.postStaining2",
        counter_name="numBlocks",
        out_queue=env.processes["postStaining"].in_queue
    )
    env.processes["collate.postStaining"] = Collator(  # Slides -> Blocks
        "collate.postStaining",
        counter_name="numSlides",
        out_queue=env.processes["collate.postStaining2"].in_queue
    )
    
    # DELIVERY
    env.processes["stainingToLabelling"] = DeliveryProcess(
        "stainingToLabelling",
        resource=env.resources["Staining staff"],
        out_duration=env.minutes(5.0),
        return_duration=env.minutes(5.0),
        out_queue=env.completed_specimens
        # out_queue=env.processes["labelling"].in_queue
    )
    env.processes["batcher.stainingToLabelling"] = Batcher(
        "batcher.stainingToLabelling",
        batch_size=env.batch_sizes["Deliver (staining to labelling)"],
        out_cls=Batch[Specimen],
        out_queue=env.processes["stainingToLabelling"].in_queue
    )

def staining_start(self: Specimen):
    """Stain each slide associated with a specimen."""
    env: Model = self.env
    env.states["inStaining"].set(env.states["inStaining"]() + 1)

    for block in self.blocks:
        for slide in block.slides:
            if slide.data["slide_type"] == "megas":
                slide.enter_sorted(env.processes["batcher.stainingMegas"].in_queue, self.prio)
            else:
                slide.enter_sorted(env.processes["batcher.stainingRegular"].in_queue, self.prio)

def staining_regular(self: Batch[Slide]):
    """Stain a batch of regular slides."""
    env: Model = self.env

    # LOAD MACHINE
    yield self.request((env.resources["Staining staff"], 1),
                       (env.resources["Staining machine"], 1), reason="Staining (regular)")
    yield self.hold(env.task_durations["Load staining machine (regular)"])
    self.release(env.resources["Staining staff"])

    # STAINING
    yield self.hold(env.task_durations["Staining (regular)"])

    # UNLOAD MACHINE
    yield self.request((env.resources["Staining staff"], 1), reason="Unload staining machine")
    self.release()  # release all

    for slide in self.items:
        slide.enter(env.processes["collate.postStaining"].in_queue)

def staining_megas(self: Batch[Slide]):
    """Stain a batch of mega slides."""
    env: Model = self.env

    # LOAD MACHINE
    yield self.request((env.resources["Staining staff"], 1),
                       (env.resources["Staining machine"], 1), reason="Staining (megas)")
    yield self.hold(env.task_durations["Load staining machine (megas)"])
    self.release(env.resources["Staining staff"])

    # STAINING
    yield self.hold(env.task_durations["Staining (megas)"])

    # UNLOAD MACHINE
    yield self.request((env.resources["Staining staff"], 1), reason="Unload staining machine")
    self.release()  # release all

    for slide in self.items:
        slide.enter(env.processes["collate.postStaining"].in_queue)

def post_staining(self: Specimen):
    """Post-staining tasks."""
    env: Model = self.env

    env.states["inStaining"].set(env.states["inStaining"]() - 1)
    self.data["stainedTime"] = env.now()

    env.states["WIP"].set(env.states["WIP"]() - 1)
    self.enter_sorted(env.processes["batcher.stainingToLabelling"].in_queue, priority=self.prio)
