import { FormValues } from "~/pages/digital-hospital/simulate";
import { API_URL } from "./config";

const runSimulation = async (values: FormValues) => {
  type RequestBody = {
    timestamp: number; // unix timestamp in miliseconds
    jobId: string;
    files: string[]; // base64 encoded
    weeks: number;
    confidenceAnalysis: boolean;
  };

  const ts = Math.floor(Date.now());

  const fileObjects = values.files as FileList;
  const filesBase64 = await Promise.all(
    Array.from(fileObjects).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
      });
    })
  );

  const requestBody: RequestBody = {
    timestamp: ts,
    jobId: values.jobId || ts.toString(),
    files: filesBase64,
    weeks: values.weeks,
    confidenceAnalysis: values.confidenceAnalysis,
  };

  // make POST request to backend
  const response = await fetch(`${API_URL}/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  const data = await response.json();
  return data;
};
