import { BarChartData, LineChartData } from "charts";

export const DH_API_URL = "http://127.0.0.1:5000";
export const SENSOR_API_URL = "http://localhost:8000";
export const SENSOR_WS_URL = "ws://localhost:8000/ws/";

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
  wip_by_stage: LineChartData[]; // +++++ WIP by Stage
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
  individual_results: SimulationResults[]; // Results for each Scenario
};
