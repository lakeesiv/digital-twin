import * as dfd from "danfojs";
import { SimulationResults } from "../config";

function seriesData(df: dfd.DataFrame, labels?: string[]) {
  return {
    x: df.index as number[],
    labels: labels ?? df.columns,
    y: df.T.values as number[][], // assumption: df contains numbers only
  };
}

function categoricalData(df: dfd.DataFrame, labels?: string[]) {
  return {
    x: df.index as string[],
    labels: labels ?? df.columns,
    y: df.T.values as number[][], // assumption: df contains numbers only
  };
}

export type BarChartData = {
  title: string;
  xlabel: string;
  ylabel: string;
  data: {
    x: (string | number)[]; // categories
    labels: string[]; // e.g. KPIs
    y: number[][]; // y[a][b] for category a, KPI b
    ymin?: number[][]; // Same as y, but for the lower bound
    ymax?: number[][]; // Same as y, but for the upper bound
  };
};

export type LineChartData = {
  title: string;
  xlabel: string;
  ylabel: string;
  data: {
    x: number[];
    labels: string[]; // series labels
    y: number[][]; // y[series index][x index]
    ymin?: number[][]; // Same as y, but for the lower bound
    ymax?: number[][]; // Same as y, but for the upper bound
  };
};

export class SimulationResultsClass {
  overall_tat: number;
  progress: {
    "7": number;
    "10": number;
    "12": number;
    "21": number;
  };
  lab_tat: number;
  lab_progress: {
    "3": number;
  };
  tat_by_stage: BarChartData;
  resource_allocation: LineChartData[]; // line chart for each resource
  wip_by_stage: LineChartData[]; // line chart for each stage
  utilization_by_resource: BarChartData;
  daily_utilization_by_resource: LineChartData;

  constructor(
    overall_tat: number,
    progress: [number, number, number, number],
    lab_tat: number,
    lab_progress: number,
    tat_by_stage: dfd.DataFrame,
    res_dfs: { [key: string]: dfd.DataFrame },
    wip_dfs: { [key: string]: dfd.DataFrame },
    util_df: dfd.DataFrame,
    hourly_util_df: dfd.DataFrame
  ) {
    this.overall_tat = overall_tat;
    this.progress = {
      "7": progress[0],
      "10": progress[1],
      "12": progress[2],
      "21": progress[3],
    };
    this.lab_tat = lab_tat;
    this.lab_progress = {
      "3": lab_progress,
    };
    this.tat_by_stage = {
      title: "Turnaround time by stage",
      xlabel: "Stage",
      ylabel: "TAT (hours)",
      data: categoricalData(tat_by_stage),
    };

    this.resource_allocation = [];
    for (const [key, value] of Object.entries(res_dfs)) {
      this.resource_allocation.push({
        title: `'Resource allocation: ${key}'`,
        xlabel: "Time (hours)",
        ylabel: "Number allocated",
        data: seriesData(value, ["Number allocated"]),
      });
    }

    this.wip_by_stage = [];
    for (const [key, value] of Object.entries(wip_dfs)) {
      this.wip_by_stage.push({
        title: `'Work in progress: ${key}'`,
        xlabel: "Time (hours)",
        ylabel: "WIP",
        data: seriesData(value, ["Hourly mean"]),
      });
    }

    this.utilization_by_resource = {
      title: "Mean utilisation by resource",
      xlabel: "Resource name",
      ylabel: "Mean utilisation",
      data: categoricalData(util_df),
    };

    this.daily_utilization_by_resource = {
      title: "Hourly resource usage",
      xlabel: "Time (hours)",
      ylabel: "Number busy",
      data: seriesData(hourly_util_df),
    };
  }
}

// returns a DataFrame from a dict (created in Python using `df.to_dict('split')`)
function getDF(data: { [key: string]: object }, key: string): dfd.DataFrame {
  // @ts-ignore
  return new dfd.DataFrame(data[key]["data"], {
    // @ts-ignore
    index: data[key]["index"],
    // @ts-ignore
    columns: data[key]["columns"],
  });
}

function parseFile(jsonData: {
  [key: string]: object;
}): SimulationResultsClass {
  //   const jsonString = readFileSync(filename, "utf8");
  //   const jsonData: { [key: string]: object } = JSON.parse(jsonString);

  const tatDist = getDF(jsonData, "tat_dist");
  const tatSummary = getDF(jsonData, "tat_summary");

  // Get one DataFrame per resource so we can convert each DataFrame to
  // its own LineChartData later
  var alloc = {};
  for (const key of Object.keys(jsonData["resource_allocations"])) {
    // @ts-ignore
    alloc[key] = getDF(
      jsonData["resource_allocations"] as { [key: string]: object },
      key
    );
  }

  // Get one DataFrame per stage so we can convert each DataFrame to its own
  // LineChartData later
  const wip2D = getDF(jsonData, "wip_hourly_mean");
  var wip = {};
  for (const stage of wip2D.columns) {
    // @ts-ignore
    wip[stage] = wip2D.loc({ columns: [stage] });
  }

  const overallTAT = (tatSummary.at("mean", "TAT") as number) / 24;
  const progress: [number, number, number, number] = [
    (tatDist.at(7, "TAT") as number) / 24,
    (tatDist.at(10, "TAT") as number) / 24,
    (tatDist.at(12, "TAT") as number) / 24,
    (tatDist.at(21, "TAT") as number) / 24,
  ];
  const labTAT = (tatSummary.at("mean", "TAT_lab") as number) / 24;
  const labProgress = (tatDist.at(3, "TAT_lab") as number) / 24;

  const tat_by_stage = getDF(jsonData, "tat_by_stage");
  const utilisation_means = getDF(jsonData, "utilisation_means");
  const resource_usages_hourly = getDF(jsonData, "resource_usages_hourly");

  return new SimulationResultsClass(
    overallTAT,
    progress,
    labTAT,
    labProgress,
    tat_by_stage,
    alloc,
    wip,
    utilisation_means,
    resource_usages_hourly
  );
}

export const transformApiData = (jsonData: { [key: string]: object }) => {
  const results = parseFile(jsonData);

  return results as SimulationResults;
};
