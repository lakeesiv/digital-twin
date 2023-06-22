"""Entry point for: python -m histopath.model"""
import json
from statistics import mean

import pandas as pd
from matplotlib import pyplot as plt

from .core import Model

CONFIG_FILE = "config.xlsx"
SPECIMEN_LOG_FILENAME = "test_logs/specimens.log"

app = Model(random_seed="*", time_unit="hours",
            config_file=CONFIG_FILE)  # * = random seed, None = 1234567

app.run(app.weeks(10), animate=False)

### SPECIMEN LOG AND STATISTICS ###
specimen_log = {s.name(): s.data for s in app.completed_specimens.as_list()}

# Sort specimen_log by specimen number
specimen_log = dict(sorted(
    specimen_log.items(),
    key=lambda item: int(item[0].split(".")[1])  # "specimen.1234" => 1234
))

# Write to file (JSON)
if SPECIMEN_LOG_FILENAME is not None:
    with open(SPECIMEN_LOG_FILENAME, 'w', encoding="utf-8") as log_file:
        json.dump(specimen_log, log_file, indent=2)

### RESOURCE STATS ###
df: pd.DataFrame = app.resources["Staining staff"].requesters().length.as_dataframe()
df.columns = ["t", "waiting_tasks"]
df.plot(x="t", y="waiting_tasks", title="Staining staff",
        xlabel="Time (hours)", drawstyle="steps-post")
plt.show()

df: pd.DataFrame = app.resources["Staining machine"].requesters().length.as_dataframe()
df.columns = ["t", "waiting_tasks"]
df.plot(x="t", y="waiting_tasks", title="Staining machine",
        xlabel="Time (hours)", drawstyle="steps-post")
plt.show()

df: pd.DataFrame = app.states["WIP"].value.as_dataframe()
df.columns = ["t", "WIP"]
df.plot(x="t", y="WIP", title="WIP Specimens", xlabel="Time (hours)", drawstyle="steps-post")
plt.show()

df: pd.DataFrame = app.states["inStaining"].value.as_dataframe()
df.columns = ["t", "inStaining"]
df.plot(x="t", y="inStaining", title="Specimens in Staining",
        xlabel="Time (hours)", drawstyle="steps-post")
plt.show()

### SPECIMEN STATS ###
print("Mean times:")
print("    Arrival to booked-in:",
      mean([(dic["bookedInTime"] - dic["arrivedTime"]) for dic in specimen_log.values()]))
print("    Booked-in to cut up:",
      mean([(dic["cutupTime"] - dic["bookedInTime"]) for dic in specimen_log.values()]))
print("    Cut up to processed:",
      mean([(dic["processedTime"] - dic["cutupTime"]) for dic in specimen_log.values()]))
