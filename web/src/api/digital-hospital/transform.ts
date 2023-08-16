import * as dfd from "danfojs";
import { SimulationResults } from "../config";

function seriesData(
  df: dfd.DataFrame,
  labels?: string[],
  df_min?: dfd.DataFrame,
  df_max?: dfd.DataFrame
) {
  return {
    x: df.index as number[],
    labels: labels ?? df.columns,
    y: df.T.values as number[][], // assumption: df contains numbers only
    ymin: df_min?.T.values as number[][] | undefined,
    ymax: df_max?.T.values as number[][] | undefined,
  };
}

function categoricalData(
  df: dfd.DataFrame,
  labels?: string[],
  df_min?: dfd.DataFrame,
  df_max?: dfd.DataFrame
) {
  return {
    x: df.index as string[],
    labels: labels ?? df.columns,
    y: df.T.values as number[][], // assumption: df contains numbers only
    ymin: df_min?.T.values as number[][] | undefined,
    ymax: df_max?.T.values as number[][] | undefined,
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
  overall_tat_min: number | undefined;
  overall_tat_max: number | undefined;

  progress: { "7": number; "10": number; "12": number; "21": number };
  progress_min:
    | { "7": number; "10": number; "12": number; "21": number }
    | undefined;
  progress_max:
    | { "7": number; "10": number; "12": number; "21": number }
    | undefined;

  lab_tat: number;
  lab_tat_min: number | undefined;
  lab_tat_max: number | undefined;

  lab_progress: { "3": number };
  lab_progress_min: { "3": number } | undefined;
  lab_progress_max: { "3": number } | undefined;

  tat_by_stage: BarChartData;
  resource_allocation: LineChartData[]; // line chart for each resource
  wip_by_stage: LineChartData[]; // line chart for each stage
  utilization_by_resource: BarChartData;
  daily_utilization_by_resource: LineChartData;

  constructor(
    overall_tat: number,
    overall_tat_min: number | undefined,
    overall_tat_max: number | undefined,

    progress: [number, number, number, number],
    progress_min: [number, number, number, number] | undefined,
    progress_max: [number, number, number, number] | undefined,

    lab_tat: number,
    lab_tat_min: number | undefined,
    lab_tat_max: number | undefined,

    lab_progress: number,
    lab_progress_min: number | undefined,
    lab_progress_max: number | undefined,

    tat_by_stage: dfd.DataFrame,
    res_dfs: { [key: string]: dfd.DataFrame },
    wip_dfs: { [key: string]: dfd.DataFrame },
    util_df: dfd.DataFrame,
    hourly_util_df: dfd.DataFrame
  ) {
    this.overall_tat = overall_tat;
    this.overall_tat_min = overall_tat_min;
    this.overall_tat_max = overall_tat_max;

    this.progress = {
      "7": progress[0],
      "10": progress[1],
      "12": progress[2],
      "21": progress[3],
    };
    this.progress_min = progress_min && {
      "7": progress_min[0],
      "10": progress_min[1],
      "12": progress_min[2],
      "21": progress_min[3],
    };
    this.progress_max = progress_max && {
      "7": progress_max[0],
      "10": progress_max[1],
      "12": progress_max[2],
      "21": progress_max[3],
    };

    this.lab_tat = lab_tat;
    this.lab_tat_min = lab_tat_min;
    this.lab_tat_max = lab_tat_max;

    this.lab_progress = { "3": lab_progress };
    this.lab_progress_min = lab_progress_min
      ? { "3": lab_progress_min }
      : undefined;
    this.lab_progress_max = lab_progress_max
      ? { "3": lab_progress_max }
      : undefined;

    this.tat_by_stage = {
      title: "Turnaround time by stage",
      xlabel: "Stage",
      ylabel: "TAT (hours)",
      data: categoricalData(
        tat_by_stage,
        undefined
        // tat_by_stage.mul(0.9) as dfd.DataFrame,
        // tat_by_stage.mul(1.1) as dfd.DataFrame
      ),
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
        data: seriesData(
          value,
          ["Hourly mean"]
          // value.mul(0.9) as dfd.DataFrame,
          // value.mul(1.1) as dfd.DataFrame
        ),
      });
    }

    this.utilization_by_resource = {
      title: "Mean utilisation by resource",
      xlabel: "Resource name",
      ylabel: "Mean utilisation",
      data: categoricalData(
        util_df,
        undefined
        // util_df.mul(0.9) as dfd.DataFrame,
        // util_df.mul(1.1) as dfd.DataFrame
      ),
    };

    this.daily_utilization_by_resource = {
      title: "Hourly resource usage",
      xlabel: "Time (hours)",
      ylabel: "Number busy",
      data: seriesData(
        hourly_util_df,
        undefined
        // hourly_util_df.mul(0.9) as dfd.DataFrame,
        // hourly_util_df.mul(1.1) as dfd.DataFrame
      ),
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
  type fourNumbers = [number, number, number, number];

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

  const overallTAT = tatSummary.at("mean", "TAT") as number;
  const progress: fourNumbers = [
    tatDist.at(7, "TAT") as number,
    tatDist.at(10, "TAT") as number,
    tatDist.at(12, "TAT") as number,
    tatDist.at(21, "TAT") as number,
  ];
  const labTAT = tatSummary.at("mean", "TAT_lab") as number;
  const labProgress = tatDist.at(3, "TAT_lab") as number;

  const tat_by_stage = getDF(jsonData, "tat_by_stage");
  const utilisation_means = getDF(jsonData, "utilisation_means");
  const resource_usages_hourly = getDF(jsonData, "resource_usages_hourly");

  return new SimulationResultsClass(
    overallTAT,
    overallTAT * 0.9,
    overallTAT * 1.1,
    progress,
    progress.map((x: number) => x * 0.9) as fourNumbers,
    progress.map((x: number) => x * 1.1) as fourNumbers,
    labTAT,
    labTAT * 0.9,
    labTAT * 1.1,
    labProgress,
    labProgress * 0.9,
    labProgress * 1.1,
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
