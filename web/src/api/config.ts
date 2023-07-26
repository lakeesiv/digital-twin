import { BarChartData, LineChartData } from "charts";

export const API_URL = "http://localhost:7000";
export const SENSOR_API_URL = "http://localhost:8000";
export const SENSOR_WS_URL = "ws://localhost:8000/ws/";

export type SimulationResults = {
  overallTAT: number;
  progress: {
    "7": number;
    "10": number;
    "12": number;
    "21": number;
  };
  labTAT: number;
  labProgress: {
    "3": number;
  };
  tat_by_stage: BarChartData;
  resource_allocation: LineChartData[];
  utilization_by_stage: BarChartData;
  daily_utilization_by_stage: LineChartData;
};
