import { useCallback } from "react";
import useRTWebSocket from "./useRTWebSocket";

const useRTRecords = () => {
  const { lastMessage, sendJsonMessage, connectionStatus, rtConnected } =
    useRTWebSocket("wss://tfc-app9.cl.cam.ac.uk/rtmonitor/WS/mqtt_acp", {
      onConnect: () => {
        sendJsonMessage({
          msg_type: "rt_request",
          request_id: "A",
          options: ["latest_records"],
        });
      },
    });

  const refreshRecords = useCallback(() => {
    sendJsonMessage({
      msg_type: "rt_request",
      request_id: "A",
      options: ["latest_records"],
    });
  }, []);

  return {
    history: lastMessage,
    refreshRecords,
    connectionStatus,
    rtConnected,
  };
};

export default useRTRecords;
