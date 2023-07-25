from histopath.model import Model
from statistics import mean


def simulate(weeks: int = 2):
    CONFIG_FILE = "config.xlsx"
    app = Model(random_seed="*", time_unit="hours",
                config_file=CONFIG_FILE)
    app.run(app.weeks(weeks), animate=False)
    return app


def bone_station_data(app: Model):
    res = {}
    # BONE STATION

    # number_busy
    df = app.resources["Bone station"].claimed_quantity.as_dataframe()
    df.columns = ["t", "number_busy"]
    df["t"] = df["t"].apply(lambda x: round(x, 1))
    # rename columns to x and y
    df = df.rename(columns={"t": "x", "number_busy": "y"})
    df_dict = df.to_dict('list')
    data = {
        "data": df_dict,
        "title": "Number of Busy Resources",
        "xlabel": "Time (hours)",
        "ylabel": "Number of Busy Resources",
    }

    res["busy"] = data

    # waiting_tasks

    df = app.resources["Bone station"].requesters().length.as_dataframe()
    df.columns = ["t", "waiting_tasks"]
    df["t"] = df["t"].apply(lambda x: round(x, 1))
    df = df.rename(columns={"t": "x", "waiting_tasks": "y"})
    df_dict = df.to_dict('list')

    data = {
        "data": df_dict,
        "title": "Number of Waiting Tasks",
        "xlabel": "Time (hours)",
        "ylabel": "Number of Waiting Tasks",
    }

    res["waiting"] = data
    

    # metrics

    metrics = {}
    mean_busy = app.resources["Bone station"].claimed_quantity.mean()
    mean_scheduled = app.resources["Bone station"].capacity.mean()
    utilization = mean_busy / mean_scheduled

    metrics["mean_busy"] = mean_busy
    metrics["mean_scheduled"] = mean_scheduled
    metrics["utilization"] = utilization

    res["metrics"] = metrics

    return res


def processing_room_staff(app):
    # PROCESSING ROOM STAFF
    res = {}

    # waiting_tasks
    df = app.resources["Processing room staff"].requesters(
    ).length.as_dataframe()
    df.columns = ["t", "waiting_tasks"]
    df["t"] = df["t"].apply(lambda x: round(x, 1))
    df = df.rename(columns={"t": "x", "waiting_tasks": "y"})

    df_dict = df.to_dict('list')

    data = {
        "data": df_dict,
        "title": "Number of Waiting Tasks",
        "xlabel": "Time (hours)",
        "ylabel": "Number of Waiting Tasks",
    }

    res["waiting"] = data

    # metrics
    metrics = {}
    mean_busy = app.resources["Processing room staff"].claimed_quantity.mean()
    mean_scheduled = app.resources["Processing room staff"].capacity.mean()
    utilization = mean_busy / mean_scheduled

    metrics["mean_busy"] = mean_busy
    metrics["mean_scheduled"] = mean_scheduled
    metrics["utilization"] = utilization

    res["metrics"] = metrics

    return res


def specimen_stats(app: Model):
    specimen_log = {
        s.name(): s.data for s in app.completed_specimens.as_list()}
    res = {}

    arrival_to_booked = mean(
        [(dic["bookedInTime"] - dic["arrivedTime"])
         for dic in specimen_log.values()])
    booked_in_to_cutup = mean([(dic["cutupTime"] - dic["bookedInTime"])
                               for dic in specimen_log.values()])

    cutup_to_processed = mean([(dic["processedTime"] - dic["cutupTime"])
                               for dic in specimen_log.values()])

    res["arrival_to_booked"] = arrival_to_booked
    res["booked_in_to_cutup"] = booked_in_to_cutup
    res["cutup_to_processed"] = cutup_to_processed

    tat_to_stained = list([(dic["stainedTime"] - dic["arrivedTime"]) for dic in specimen_log.values()])

    res["tat_to_stained"] = tat_to_stained

    return res


def wip_stats(app: Model):
    # WIP STATS

    res = {}

    df=app.states["WIP"].value.as_dataframe()
    df.columns = ["t", "value"]
    df["t"] = df["t"].apply(lambda x: round(x, 1))
    df = df.rename(columns={"t": "x", "value": "y"})

    df_dict = df.to_dict('list')

    data = {
        "data": df_dict,
        "title": "WIP",
        "xlabel": "Time (hours)",
        "ylabel": "Number of Specimens in WIP",
    }



    res["wip"] = data

    df=app.states["inStaining"].value.as_dataframe()
    df.columns = ["t", "value"]
    df["t"] = df["t"].apply(lambda x: round(x, 1))

    df = df.rename(columns={"t": "x", "value": "y"})

    df_dict = df.to_dict('list')
    data = {
        "data": df_dict,
        "title": "Number in Staining",
        "xlabel": "Time (hours)",
        "ylabel": "Number of Specimens in Staining",
    }

    

    res["in_staining"] = data
    
    return res


def get_all(app: Model):
    res = {}

    res["bone_station"] = bone_station_data(app)
    res["processing_room_staff"] = processing_room_staff(app)
    res["specimen_stats"] = specimen_stats(app)
    res["wip_stats"] = wip_stats(app)

    return res


