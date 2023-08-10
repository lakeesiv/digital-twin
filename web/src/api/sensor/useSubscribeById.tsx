import { useEffect, useState } from "react";
import { SENSOR_WS_URL } from "../config";
import useWebSocket from "./useWebSocket";

const useSubscribeById = (id: string | undefined) => {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (id !== undefined) {
      setUrl(`${SENSOR_WS_URL}${id}`);
    }
  }, [id]);

  const { lastMessage, connectionStatus, messageHistory, setMessageHistory } =
    useWebSocket(url, {
      condition: id !== undefined && url !== undefined, // only connect when id is defined
    });

  return {
    lastMessage,
    connectionStatus,
    messageHistory,
    setMessageHistory,
  };
};

export default useSubscribeById;
