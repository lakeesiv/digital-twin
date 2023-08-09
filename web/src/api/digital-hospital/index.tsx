import { DH_API_URL } from "../config";
import { transformApiData } from "./transform";

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

  const response = await fetch(`${DH_API_URL}/scenario`, {
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
  done: boolean;
  id: number;
  progress: number;
  timestamp: number;
};

export const listScenarios = async () => {
  const response = await fetch(`${DH_API_URL}/scenario/list`);
  const data = await response.json();
  return data as ScenarioListItem[];
};

export const getScenario = async (id: number) => {
  const response = await fetch(`${DH_API_URL}/scenario/${id}/results`);
  const data = await response.json();
  return transformApiData(data);
};
