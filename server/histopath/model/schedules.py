"""Methods and classes for creating schedules."""
from dataclasses import dataclass
from typing import Any, Self, Sequence

import numpy as np
import pandas as pd
import salabim as sim


@dataclass
class Schedule:
    """A generic schedule with durations and quantities."""
    durations: Sequence[float]
    values: Sequence[Any]

    @staticmethod
    def resource_schedule(days: pd.DataFrame, hours: pd.DataFrame) -> Self:
        """Make a weekly resource schedule.

        Args:
            days (pandas.DataFrame):
                Single-row dataframe with columns "MON" to "SUN";
                the value in each column is 1 if the resource is
                scheduled for that day and 0 otherwise.
            hours (pandas.DataFrame):
                Single-row dataframe with columns "00:00" to "23:30" in half-hour intervals;
                the value in each column is the number of resource units scheduled in that
                half-hour (on scheduled days).
        """
        env = sim.default_env()

        durations = []
        values = []
        for day in ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]:
            avail_day = days.loc[days.day == day, "available"].to_list()[0]
            if avail_day > 0:
                values_np: np.ndarray = avail_day * hours.available.to_numpy()
                hours_in_day = int(env.days(1.0)/env.hours(0.5))
                durations += ([env.hours(0.5)]*hours_in_day)
                values += values_np.tolist()
            else:
                durations.append(env.days(1.0))
                values.append(0)
        return __class__(durations, values)

    @staticmethod
    def make_arrival_schedule(data_frame: pd.DataFrame) -> Self:
        """Make a weekly arrival schedule from a `DataFrame` of rates.

        Args:
            data_frame (pandas.DataFrame): Represents a matrix with hours as rows and
                days of the week as columns.  The arrival rate in a given hour of the
                week is given by the corresponding entry in the
                :class:`~pandas:pandas.DataFrame`.

        Returns:
            Self: A new `Schedule` object.
        """
        rates = [
            *data_frame.MON.to_list(), *data_frame.TUE.to_list(), *data_frame.WED.to_list(),
            *data_frame.THU.to_list(), *data_frame.FRI.to_list(), *data_frame.SAT.to_list(),
            *data_frame.SUN.to_list()
        ]
        env = sim.default_env()
        return __class__([env.hours(1.0)]*int(env.weeks(1.0)), rates)
