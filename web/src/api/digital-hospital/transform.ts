/***
 *
 * THIS FILE IS A MASSIVE LAST MINUTE HACK
 *
 */

// import { SimulationResults } from "../config";
import type { BarChartData, LineChartData } from "charts";

type ChartData = Omit<LineChartData["data"], "labels">;
type MultiChartData = LineChartData["data"];

export type SimulationResults = {
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
  resource_allocation: LineChartData[];
  wip_by_stage: LineChartData[];
  // queue_by_stage: LineChartData[]; // ++++++++++++++++
  utilization_by_resource: BarChartData;
  daily_utilization_by_resource: LineChartData;
};

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
  resource_allocation: {
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
  };
  tat_by_stage: ChartData;
  utilization_by_resource: ChartData;
  wip_by_stage: MultiChartData;
  hourly_utilization_by_resource: MultiChartData;
}

const transformChartDataToLineData = (
  data: ChartData,
  title: string = "",
  xlabel: string = "Time (hrs)",
  ylabel: string = ""
): LineChartData => {
  const fixedData: LineChartData["data"] = {
    x: data.x,
    // @ts-ignore
    y: [data.y],
    // @ts-ignore
    ymax: data?.ymax ? [data?.ymax] : undefined,
    // @ts-ignore
    ymin: data?.ymin ? [data?.ymin] : undefined,
    labels: [title] as string[],
  };

  if (title === "BMS") {
    console.log("BMS", fixedData);
  }

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
  const fixedData: LineChartData["data"] = {
    x: data.x,
    // @ts-ignore
    y: [data.y],
    // @ts-ignore
    ymax: data?.ymax ? [data?.ymax] : undefined,
    // @ts-ignore
    ymin: data?.ymin ? [data?.ymin] : undefined,
    labels: [title] as string[],
  };
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
