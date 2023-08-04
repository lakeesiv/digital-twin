import { SENSOR_WS_URL } from "../config";
import useWebSocket from "./useWebSocket";

const useSubscribeByAll = () => {
  const url = `${SENSOR_WS_URL}`;

  const { lastMessage, connectionStatus, messageHistory, setMessageHistory } =
    useWebSocket(url);

  return {
    lastMessage,
    connectionStatus,
    messageHistory,
    setMessageHistory,
  };
};

export default useSubscribeByAll;
