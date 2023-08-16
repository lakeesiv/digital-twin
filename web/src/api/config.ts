import { BarChartData, LineChartData } from "charts";
import { siteConfig } from "site.config";

export const DH_API_URL = siteConfig.DH_API_URL;
export const SENSOR_API_URL = siteConfig.SENSOR_API_URL;
export const SENSOR_WS_URL = siteConfig.SENSOR_WS_URL;

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

/*
 * Scenario Analysis Results
 *
 * We have a Lab Results section which compares the scenarios
 * We have an Individual Results section which shows the results for each scenario
 * To see the Lab Metrics section see link
   @link https://digital-twin-web-delta.vercel.app/digital-hospital/jobs/scenario?id=job-1
 */
export type ScenarioAnalysisResults = {
  lab_metrics: {
    tat: number[]; // TAT for each Scenario
    mean_utilization: number[]; // Mean Utilization for each Scenario
    daily_utilization: LineChartData[]; // Daily Utilization for each Scenario (each scenario is an indivual line)
  };
  individual_result_ids: string[]; // OR can be a number (I can change it later)
};
