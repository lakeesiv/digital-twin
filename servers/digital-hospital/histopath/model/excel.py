"""Functions for parsing an Excel file containing the model configuration."""
from io import BytesIO
from os import PathLike
from typing import TYPE_CHECKING

import numpy as np
import openpyxl as xl
import pandas as pd
import salabim as sim
from openpyxl.cell.cell import Cell

from .pert import PERT
from .schedules import Schedule

if TYPE_CHECKING:
    from model import Model


def get_name(workbook: xl.Workbook, name: str) -> float | np.ndarray:
    """Read an Excel named range as a single value or NumPy array.
    Arrays are flattened to one dimension if possible.

    Args:
        workbook (openpyxl.workbook.workbook.Workbook): The workbook object.
        name (str): Name of the Excel range to read.

    Returns:
        float | np.ndarray: A float or NumPy array containing the named range's values.
    """
    worksheet, cell_range = list(workbook.defined_names[name].destinations)[0]
    cell_range = str.replace(cell_range, "$", "")
    cells = workbook[worksheet][cell_range]
    if isinstance(cells, Cell):
        value = cells.value
    else:
        value = [[cell.value for cell in r] for r in cells]
        value = np.array(value).squeeze()
    return value


def get_table(workbook: xl.Workbook, sheet_name: str, name: str) -> pd.DataFrame:
    """Gets a named table from an Excel workbook as a pandas array

    Args:
        workbook (openpyxl.workbook.workbook.Workbook): The workbook object.
        sheet (str): Name of the worksheet containing the table.
        name (str): Name of the table to read.

    Returns:
        pd.DataFrame: A pandas dataframe containing the named table's values.
    """
    # Named Tables in openpyxl belong to the worksheet
    sheet = workbook[sheet_name]
    cell_range = sheet[sheet.tables[name].ref]

    vals = [[cell.value for cell in row] for row in cell_range]
    return pd.DataFrame(vals[1:], columns=vals[0])


def hmm_to_float(_str: str) -> float:
    """Convert `h:mm` string to a float. For example, `"50:30"`
    is converted to `50.5`.

    Args:
        _str (str): A string with format `"h:mm"`, e.g. `"1:30"`.

    Returns:
        float: Numeric representation of `_str`.
    """
    return float(_str[:-3]) + float(_str[-2:])/60


def parse_resources_df(df: pd.DataFrame) -> dict[str, Schedule]:
    """Parse a dataframe of resource definitions.

    The dataframe should contain the following columns:

    - Resource
    - Day-of week columns: MON to SUN
    - Time-of-day colums: e.g. 00:00, 00:30, ... 23:30.

    The day-of-week and time-of-day columns of the dataframe
    a `ResourceScheduler` process.

    The number of units of a resource at a given time in the simulation is the product
    of its entries in the matching day-of-week and time-of-day columns in the
    `df` dataframe.
    """
    my_dict = {}
    for _, row in df.iterrows():
        name = row['Resource']

        days = row["MON":"SUN"].to_frame().reset_index(drop=False)
        days = days.rename(columns={"index": "day", days.columns[1]: "available"})
        days.available = days.available.astype(int)

        hours = row.drop(row["Resource":"SUN"].index).to_frame().reset_index(drop=False)
        hours = hours.rename(columns={"index": "hour", hours.columns[1]: "available"})
        hours.available = hours.available.fillna(0).astype(int)
        hours.hour = [hmm_to_float(h) for h in hours.hour]

        my_dict[name] = Schedule.resource_schedule(days, hours)
    return my_dict


def parse_durations_df(df: pd.DataFrame) -> dict[str,  sim.Distribution]:
    """Parse a dataframe of task duration definitions.

    The dataframe should contain the following columns:

    - Task: the task name.
    - Distribution: "Constant", "Triangular", or "PERT".
    - Optimistic: the lower limit of the distribution.
    - Most Likely: the mode of the distribution.
    - Pessimistic: the upper limit of the distribution.
    - Units: a time unit string, e.g. "sec", "min" or "hour".
    """
    my_dict = {}
    for _, row in df.iterrows():
        name: str = row["Task"]
        units: str = row["Units"]
        units = units.lower().strip()

        if units in ["yr", "year", "years"]:
            units = "years"
        elif units in ["wk", "week", "weeks"]:
            units = "weeks"
        elif units in ["d", "day", "days"]:
            units = "days"
        elif units in ["h", "hr", "hour", "hours"]:
            units = "hours"
        elif units in ["m", "min", "minute", "minutes"]:
            units = "minutes"
        elif units in ["s", "sec", "second", "seconds"]:
            units = "seconds"
        else:
            raise ValueError(f"Unknown time unit: {units}")

        lower = row["Optimistic"]
        mode = row["Most Likely"]
        upper = row["Pessimistic"]

        if row["Distribution"] == "Constant" or (lower == upper):
            my_dict[name] = sim.Constant(mode, units)
        elif row["Distribution"] == "Triangular":
            my_dict[name] = sim.Triangular(lower, upper, mode, units)
        elif row["Distribution"] == "PERT":
            my_dict[name] = PERT(lower, upper, mode, units)

    return my_dict


def parse_batch_sizes_df(df: pd.DataFrame) -> dict[str, int]:
    """Parse a data"""
    return df.set_index("Batch.Name").to_dict()['Size']


def load_config(env: "Model", config: BytesIO|PathLike):
    """Load model configuration from a file."""
    # load_workbook() accepts both binary files and path strings
    workbook = xl.load_workbook(config, data_only=True)

    env.arrival_schedules: dict[str, Schedule] = {}
    env.arrival_schedules["cancer"] = Schedule.make_arrival_schedule(
        get_table(workbook, "Arrival Schedules", "ArrivalScheduleCancer"))
    env.arrival_schedules["non_cancer"] = Schedule.make_arrival_schedule(
        get_table(workbook, "Arrival Schedules", "ArrivalScheduleNonCancer"))

    env.resource_schedules = parse_resources_df(get_table(workbook, "Resources", "Resources"))
    env.task_durations = parse_durations_df(get_table(workbook, "Task Durations", "TaskDurations"))
    env.batch_sizes = parse_batch_sizes_df(get_table(workbook, "Batch Sizes", "BatchSizes"))

    env.globals = {name: get_name(workbook, name) for name in list(workbook.defined_names)}
