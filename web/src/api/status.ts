import { useEffect, useState } from "react";
import { DH_API_URL, SENSOR_API_URL } from "./config";

export const useDHStatus = () => {
  const [status, setStatus] = useState<true | false>(false);

  useEffect(() => {
    const checkDHStatus = async () => {
      try {
        const response = await fetch(DH_API_URL + "/");
        const isOk = response.ok;
        setStatus(isOk);
      } catch (error) {
        console.error(error);
      }
    };

    checkDHStatus();
  }, []);

  return status;
};

export const useSensorStatus = () => {
  const [status, setStatus] = useState<true | false>(false);

  useEffect(() => {
    const checkSensorStatus = async () => {
      try {
        const response = await fetch(SENSOR_API_URL + "/");
        const isOk = response.ok;

        setStatus(isOk);
      } catch (error) {
        console.error(error);
      }
    };

    checkSensorStatus();
  }, []);

  return status;
};
