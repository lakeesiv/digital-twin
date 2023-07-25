"""Microtomy processes."""

from typing import TYPE_CHECKING

import salabim as sim

from ..pert import PERT
from ..specimens import Specimen, Slide
from .common import Batch, Batcher, DeliveryProcess, Process

if TYPE_CHECKING:
    from ..core import Model

_UNIF = sim.Uniform(0, 1).sample


def register(env: "Model"):
    """Register processes to the simulation environment."""
    env.processes["microtomy"] = Process(
        "microtomy", cls=Specimen, fn=microtomy)
    
    env.processes["microtomyToStaining"] = DeliveryProcess(
        "microtomyToStaining",
        resource=env.resources["Microtomy staff"],
        out_duration=env.minutes(5.0),
        return_duration=env.minutes(5.0),
        out_queue=env.processes["stainingStart"].in_queue
    )

    env.processes["batcher.microtomyToStaining"] = Batcher(
        "batcher.microtomyToStaining",
        batch_size=env.batch_sizes["Deliver (microtomy to staining)"],
        out_cls=Batch[Specimen],
        out_queue=env.processes["microtomyToStaining"].in_queue
    )

def microtomy(self: Specimen):
    """Generate a microtomy task for each future slide associated with a specimen."""
    env: Model = self.env
    env.states["inMicrotomy"].set(env.states["inMicrotomy"]() + 1)
    self.data["totalSlides"] = 0

    for block in self.blocks:

        yield self.request((env.resources["Microtomy staff"], 1, self.prio), reason="Microtomy")

        if block.data["block_type"] == "small surgical":
            r = _UNIF()
            if r < env.globals["ProbMicrotomyLevels"]:
                slide_type = "levels"
                yield self.hold(env.task_durations["Microtomy (levels)"])
                num_slides = round(PERT(*(env.globals["NumSlidesLevels"][[0, 2, 1]])).sample())
            else:
                slide_type = "serials"
                yield self.hold(env.task_durations["Microtomy (serials)"])
                num_slides = round(PERT(*(env.globals["NumSlidesSerials"][[0, 2, 1]])).sample())
        elif block.data["block_type"] == "large surgical":
            slide_type = "larges"
            yield self.hold(env.task_durations["Microtomy (larges)"])
            num_slides = round(PERT(*(env.globals["NumSlidesLarges"][[0, 2, 1]])).sample())
        else:
            slide_type = "megas"
            yield self.hold(env.task_durations["Microtomy (megas)"])
            num_slides = round(PERT(*(env.globals["NumSlidesMegas"][[0, 2, 1]])).sample())
        
        block.data["numSlides"] = num_slides
        self.data["totalSlides"] += num_slides
        for _ in range(num_slides):
            slide = Slide(name=f"{block.name()}.", parent=block, slide_type=slide_type)
            block.slides.append(slide)
        
        self.release()
    
    env.states["inMicrotomy"].set(env.states["inMicrotomy"]() - 1)
    self.data["microtomyTime"] = env.now()
    self.enter_sorted(env.processes["batcher.microtomyToStaining"].in_queue, priority=self.prio)
