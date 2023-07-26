import { SENSOR_API_URL } from "../config";
import { useState, useEffect } from "react";
import { SensorData } from ".";

/* 
  This function is used to get the history of a device
  it will make a request to the API and return the data
  */

const getDeviceHistory = (acp_id: string, start: Date, end: Date) => {
  // convert date to YYYY-MM-DD HH:MM:SS format
  const startDate = start.toISOString().split(".")[0];
  const endDate = end.toISOString().split(".")[0];

  const requestBody = {
    acp_id,
    start_time: startDate,
    end_time: endDate,
  };

  const url = `${SENSOR_API_URL}/history/`;
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // perform the fetch on mount
  useEffect(() => {
    const fetchLatestDevices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDevices();
  }, []);

  return { data, loading, error };
};

export default getDeviceHistory;
