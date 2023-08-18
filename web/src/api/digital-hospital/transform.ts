/***
 *
 * THIS FILE IS A MASSIVE LAST MINUTE HACK TO GET THE CHARTS WORKING WITH THE API
 * @YIN-CHI PLEASE UPDATED YOUR BACKEND TO MATCH THE SCHEMA AS BEFORE SO WE CAN
 * AVOID THIS HACK
 *
 */

import { SimulationResults } from "../config";
import type { BarChartData, LineChartData } from "charts";
import { ScenarioAnalysisResults } from "../config";

type ChartData = Omit<LineChartData["data"], "labels">;
type MultiChartData = LineChartData["data"];

interface ResourceResponse {
  BMS: ChartData;
  "Bone station": ChartData;
  "Booking-in staff": ChartData;
  "Coverslip machine": ChartData;
  "Cut-up assistant": ChartData;
  Histopathologist: ChartData;
  "Microtomy staff": ChartData;
  "Processing machine": ChartData;
  "Processing room staff": ChartData;
  "QC staff": ChartData;
  "Scanning machine (megas)": ChartData;
  "Scanning machine (regular)": ChartData;
  "Scanning staff": ChartData;
  "Staining machine": ChartData;
  "Staining staff": ChartData;
}

interface APISimulationResponse {
  lab_progress: {
    "3": number;
  };
  lab_tat: number;
  overall_tat: number;
  progress: {
    "7": number;
    "10": number;
    "12": number;
    "21": number;
  };
  q_length_by_resource: ChartData;
  resource_allocation: ResourceResponse;
  tat_by_stage: ChartData;
  utilization_by_resource: ChartData;
  wip_by_stage: MultiChartData;
  hourly_utilization_by_resource: MultiChartData;
}

const transformChartDataToLineData = (
  data: ChartData | MultiChartData,
  title: string = "",
  xlabel: string = "Time (hrs)",
  ylabel: string = ""
): LineChartData => {
  // check if data.y[0] is a number or an array
  let y = [];

  if (typeof data.y[0] === "number") {
    y = [data.y];
  } else {
    y = data.y;
  }

  const fixedData: LineChartData["data"] = {
    x: data.x,
    // @ts-ignore
    y: y,
    // @ts-ignore
    ymax: data?.ymax ? [data?.ymax] : undefined,
    // @ts-ignore
    ymin: data?.ymin ? [data?.ymin] : undefined,
    // @ts-ignore
    labels: data.labels ? data.labels : ([title] as string[]),
  };

  // if (title === "BMS") {
  //   console.log(fixedData);
  // }

  return {
    title,
    xlabel,
    ylabel,
    data: fixedData,
  };
};

const transformMultiChartDataToLineData = (
  data: MultiChartData,
  title: string = "",
  xlabel: string = "Time (hrs)",
  ylabel: string = ""
): LineChartData => {
  return {
    title,
    xlabel,
    ylabel,
    data,
  };
};

const transformChartDataToBarData = (
  data: ChartData,
  title: string = "",
  xlabel: string = "Time (hrs)",
  ylabel: string = ""
): BarChartData => {
  let y = [];

  // if (typeof data.y[0] === "number") {
  y = [data.y];
  // } else {
  //   y = data.y;
  // }

  const fixedData: LineChartData["data"] = {
    x: data.x,
    // @ts-ignore
    y: y,
    // @ts-ignore
    ymax: data?.ymax ? [data?.ymax] : undefined,
    // @ts-ignore
    ymin: data?.ymin ? [data?.ymin] : undefined,
    // @ts-ignore
    labels: data.labels ? data.labels : ([title] as string[]),
  };

  if (title === "BMS") {
    console.log(fixedData);
    console.log(data);
  }

  return {
    title,
    xlabel,
    ylabel,
    data: fixedData,
  };
};

const splitMultiLineChartIntoMultipleLineCharts = (
  data: MultiChartData
): LineChartData[] => {
  const labels = data.labels;
  const x = data.x;
  const result: LineChartData[] = [];

  for (let i = 0; i < labels.length; i++) {
    const title = labels[i];
    const xlabel = "Time (hrs)";
    const ylabel = title;
    const fixedData: LineChartData["data"] = {
      labels: [title],
      x: x,
      y: [data.y[i]],
      ymax: data?.ymax ? [data?.ymax[i]] : undefined,
      ymin: data?.ymin ? [data?.ymin[i]] : undefined,
    };

    result.push({
      title,
      xlabel,
      ylabel,
      data: fixedData,
    });
  }

  return result;
};

export const transformSimulationResults = (
  data: APISimulationResponse
): SimulationResults => {
  const {
    lab_progress,
    lab_tat,
    overall_tat,
    progress,
    q_length_by_resource,
    resource_allocation,
    tat_by_stage,
    utilization_by_resource,
    wip_by_stage,
  } = data;

  const fixed_q_length_by_resource = transformChartDataToLineData(
    q_length_by_resource,
    "Queue Length by Resource",
    "Time (hrs)",
    "Queue Length"
  );
  const fixed_resource_allocation: LineChartData[] = Object.entries(
    resource_allocation
  ).map(([key, value]) => {
    return transformChartDataToLineData(
      value,
      key,
      "Time (hrs)",
      "Utilization"
    );
  });

  const fixed_tat_by_stage = transformChartDataToBarData(
    tat_by_stage,
    "TAT by Stage",
    "Stage",
    "TAT"
  );

  const fixed_utilization_by_resource = transformChartDataToBarData(
    utilization_by_resource,
    "Utilization by Resource",
    "Resource",
    "Utilization"
  );

  const fixed_wip_by_stage: LineChartData[] =
    splitMultiLineChartIntoMultipleLineCharts(wip_by_stage);

  const fixed_hourly_utilization_by_resource: LineChartData =
    transformMultiChartDataToLineData(
      data.hourly_utilization_by_resource,
      "Hourly Utilization by Resource",
      "Time (hrs)",
      "Utilization"
    );

  return {
    lab_progress,
    lab_tat,
    overall_tat,
    progress,
    tat_by_stage: fixed_tat_by_stage,
    resource_allocation: fixed_resource_allocation,
    utilization_by_resource: fixed_utilization_by_resource,
    wip_by_stage: fixed_wip_by_stage,
    daily_utilization_by_resource: fixed_hourly_utilization_by_resource,
  };
};

interface MultiSimulationResponse {
  mean_tat: ChartData;
  mean_utilisation: ResourceResponse;
  scenario_ids: number[];
  utilisation_hourlies: ResourceResponse;
}

export const transformScenarioAnalysisResults = (
  data: MultiSimulationResponse
): ScenarioAnalysisResults => {
  const { mean_tat, mean_utilisation, scenario_ids, utilisation_hourlies } =
    data;

  const fixed_mean_tat = transformChartDataToBarData(
    mean_tat,
    "Mean TAT",
    "Scenario",
    "TAT"
  );

  const fixed_mean_utilisation: BarChartData[] = Object.entries(
    mean_utilisation
  ).map(([key, value]) => {
    return transformChartDataToBarData(value, key, "Scenario", "Utilization");
  });

  const fixed_utilisation_hourlies: LineChartData[] = Object.entries(
    utilisation_hourlies
  ).map(([key, value]) => {
    return transformChartDataToLineData(
      value,
      key,
      "Time (hrs)",
      "Utilization"
    );
  });

  // console.log(fixed_utilisation_hourlies);

  return {
    mean_tat: fixed_mean_tat,
    mean_utilisation: fixed_mean_utilisation,
    utilisation_hourlies: fixed_utilisation_hourlies,
    scenario_ids,
  };
};
