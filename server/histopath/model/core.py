"""Entity definitions for the simulation models."""
from io import BytesIO
from os import PathLike
from typing import Any

import salabim as sim

from . import excel, processes
from .processes.common import (Batcher, DeliveryProcess, Process,
                               ResourceScheduler, TimeVaryingGenerator)
from .schedules import Schedule
from .specimens import Specimen


class Model(sim.Environment):
    """The simulation model."""

    def setup(self, config_file: BytesIO | PathLike):
        """Initialise the model.

        Args:
            config_file (BytesIO | PathLike):
                The configuration file (a BytesIO), or a file path.
        """
        self.globals: dict[str, Any] = {}
        self.resource_schedules: dict[str, Schedule] = {}
        self.resources: dict[str, sim.Resource] = {}
        self.task_durations: dict[str, sim.Distribution] = {}
        self.batch_sizes: dict[str, sim.Distribution] = {}

        self.arrival_schedules = {}

        # READ EXCEL DATA
        excel.load_config(self, config_file)

        # GENERATE RESOURCE CAPACITY SCHEDULERS
        for name, schedule in self.resource_schedules.items():
            self.resources[name] = sim.Resource(name, capacity=schedule.values[0])
            ResourceScheduler(
                f'{name}.scheduler',
                resource=self.resources[name],
                durations=schedule.durations,
                capacities=schedule.values)

        # GENERATE ARRIVAL PROCESSES
        TimeVaryingGenerator(
            'generator.cancer', cls=Specimen,
            durations=self.arrival_schedules["cancer"].durations,
            rates=self.arrival_schedules["cancer"].values,
            # passed to Specimen.setup()
            cancer=True)
        TimeVaryingGenerator(
            'generator.non_cancer', cls=Specimen,
            durations=self.arrival_schedules["non_cancer"].durations,
            rates=self.arrival_schedules["non_cancer"].values,
            # passed to Specimen.setup()
            cancer=False)

        # So we can compute statistics at the end
        self.completed_specimens = sim.Store()

        # REGISTER PROCESSES OF EACH STAGE TO `self`
        # Need to process stages in reverse order, so we can chain between stages
        self.processes: dict[str, Process | Batcher | DeliveryProcess] = {}

        processes.staining.register(self)
        processes.microtomy.register(self)
        processes.processing.register(self)
        processes.cutup.register(self)
        processes.reception.register(self)
        
        # processes.staining.register(self)

        self.states: dict[str, sim.State] = {}
        self.states["WIP"] = sim.State("WIP", 0, "uint32")
        self.states["inReception"] = sim.State("inReception", 0, "uint32")
        self.states["inCutup"] = sim.State("inCutup", 0, "uint32")
        self.states["inProcessing"] = sim.State("inProcessing", 0, "uint32")
        self.states["inMicrotomy"] = sim.State("inMicrotomy", 0, "uint32")
        self.states["inStaining"] = sim.State("inStaining", 0, "uint32")

    def run(self, duration: float = None, animate: bool = True):
        """Run the model.  Should only be called once on an Model; create a new Model instance
        for multiple simulation runs. Note that many salabim functions rely on a default
        Environment, which is usually the last one created
        (Model is a subclass of salabim.Environment)

        Args:
            _app (Model):
                The model to run. Note using run_model() multiple times on a Model results in
                undefined behavior.
            duration (_type_): _description_
            animate (bool, optional): _description_. Defaults to True.
        """

        ### ANIMATION ###
        self.animation_parameters(
            animate=animate,
            speed=5,
            fps=10
        )
        if self.animate():
            self.full_screen()
        self.modelname('CUH Histopathology model')

        if self.animate():
            self.AnimateText("Booking-in staff", x=100, y=self.y1() - 100)
            self.AnimateQueue(self.resources["Booking-in staff"].claimers(),
                              title="Claimers",
                              x=50, y=self.y1() - 150, direction="s")
            self.AnimateQueue(self.resources["Booking-in staff"].requesters(),
                              title="Requesters",
                              x=50, y=self.y1() - 350, direction="s")

            self.AnimateText("BMS", x=400, y=self.y1() - 100)
            self.AnimateQueue(self.resources["BMS"].claimers(),
                              title="Claimers",
                              x=400, y=self.y1() - 150, direction="s")
            self.AnimateQueue(self.resources["BMS"].requesters(),
                              title="Requesters",
                              x=400, y=self.y1() - 350, direction="s")

            self.AnimateText("Cut-up assistants", x=700, y=self.y1() - 100)
            self.AnimateQueue(self.resources["Cut-up assistant"].claimers(),
                              title="Claimers",
                              x=700, y=self.y1() - 150, direction="s")
            self.AnimateQueue(self.resources["Cut-up assistant"].requesters(),
                              title="Requesters",
                              x=700, y=self.y1() - 350, direction="s")

        ### RUN ###
        super().run(duration)
