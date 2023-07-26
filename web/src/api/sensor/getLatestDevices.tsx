import { useEffect, useState } from "react";
import { SENSOR_API_URL } from "../config";
import { SensorData } from ".";

/* 
  This function is used to get the latest devices payload data
  to do this we make a GET request to the API and return the data
  */

const getLatestDevices = () => {
  const url = `${SENSOR_API_URL}/latest/`;
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // perform the fetch on mount
  useEffect(() => {
    const fetchLatestDevices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(String(error));
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDevices();
  }, []);

  return { data, loading, error };
};

export default getLatestDevices;
