import { SENSOR_WS_URL } from "../config";
import useWebSocket from "./useWebSocket";

const useSubscribeById = (id: string | undefined) => {
  const url = `${SENSOR_WS_URL}${id}`;

  const { lastMessage, connectionStatus, messageHistory, setMessageHistory } =
    useWebSocket(url, {
      condition: id !== undefined, // only connect when id is defined
    });

  return {
    lastMessage,
    connectionStatus,
    messageHistory,
    setMessageHistory,
  };
};

export default useSubscribeById;
