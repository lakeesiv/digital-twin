import { DH_API_URL, SimulationResults } from "../config";
import {
  transformScenarioAnalysisResults,
  transformSimulationResults,
} from "./transform";

export const newScenario = async (
  file: FileList,
  hours: number,
  repetitions: number = 1
) => {
  // conver file FileList to File[]
  const files: File[] = [];
  for (let i = 0; i < file.length; i++) {
    files.push(file[i]);
  }
  const firstFile = files[0];

  const formData = new FormData();
  formData.append("config", firstFile, "config.xlsx");
  formData.append("sim_hours", hours.toString());
  formData.append("num_reps", repetitions.toString());

  const response = await fetch(`${DH_API_URL}/scenarios`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();
  return data;
};

export const newMultiScenario = async (
  files: FileList,
  hours: number,
  repetitions: number = 1
) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(`config_${i + 1}`, files[i], `config_${i + 1}.xlsx`);
  }
  formData.append("sim_hours", hours.toString());
  formData.append("num_reps", repetitions.toString());

  const response = await fetch(`${DH_API_URL}/multi`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();
  return data;
};

export const testSimulationServer = async () => {
  const response = await fetch(`${DH_API_URL}`);
  const data = await response.json();
  return data;
};

export type ScenarioListItem = {
  completed: number;
  scenario_id: number;
  progress: number;
  created: number;
  num_reps: number;
};

export const listScenarios = async () => {
  const response = await fetch(`${DH_API_URL}/scenarios`);

  type ScenarioListResponse = {
    analysis_id?: number;
  } & ScenarioListItem;

  const data = (await response.json()) as ScenarioListResponse[];

  // remove data with analysis_id
  const filteredData = data.filter((item) => !item.analysis_id);

  return filteredData;
};

export type MultScenarioListItem = {
  completed: number;
  created: number;
  analysis_id: number;
  progress: number;
  scenario_ids: number[];
};

export const listMultiScenarios = async () => {
  const response = await fetch(`${DH_API_URL}/multi`);

  const data = (await response.json()) as MultScenarioListItem[];

  return data;
};

export const getScenario = async (id: number) => {
  const response = await fetch(`${DH_API_URL}/scenarios/${id}/results`);
  const data = await response.json();
  return transformSimulationResults(data);
};

export const getMultiScenario = async (id: number) => {
  const response = await fetch(`${DH_API_URL}/multi/${id}/results`);
  const data = await response.json();
  return transformScenarioAnalysisResults(data);
};
