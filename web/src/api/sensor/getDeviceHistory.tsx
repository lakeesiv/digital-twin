import { SENSOR_API_URL } from "../config";
import { useState, useEffect } from "react";
import { SensorData } from ".";
import { useToast } from "ui";

/* 
  This function is used to get the history of a device
  it will make a request to the API and return the data
  */

const getDeviceHistory = (
  acp_id: string | undefined,
  start: Date,
  end: Date
) => {
  // convert date to YYYY-MM-DD HH:MM:SS format
  const startDate = start.toISOString().split(".")[0];
  const endDate = end.toISOString().split(".")[0];

  const url = `${SENSOR_API_URL}/history/`;
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // perform the fetch on mount
  useEffect(() => {
    // if acp_id is undefined, don't fetch
    if (acp_id === undefined) return;

    const requestBody = {
      acp_id,
      start_time: startDate,
      end_time: endDate,
    };

    setLoading(true);
    setError(null);

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

        if (!Array.isArray(data))
          throw new Error(
            `Failed to fetch data between ${startDate} and ${endDate}`
          );

        setData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: String(error),
          variant: "destructive",
          duration: 3000,
        });
        // setError();
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDevices();
  }, [acp_id, start, end]);

  return { data, loading, error };
};

export default getDeviceHistory;
