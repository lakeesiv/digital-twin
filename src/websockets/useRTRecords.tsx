import { useCallback } from "react";
import useRTWebSocket from "./useRTWebSocket";
import { REQUEST_ID, WS_URL } from "./config";

const useRTRecords = () => {
  const { lastMessage, sendJsonMessage, connectionStatus, rtConnected } =
    useRTWebSocket(WS_URL, {
      onConnect: () => {
        sendJsonMessage({
          msg_type: "rt_request",
          request_id: REQUEST_ID,
          options: ["latest_records"],
        });
      },
    });

  const refreshRecords = useCallback(() => {
    sendJsonMessage({
      msg_type: "rt_request",
      request_id: REQUEST_ID,
      options: ["latest_records"],
    });
  }, []);

  type RecordType = {
    acp_id: string;
    acp_ts: string;
    payload_cooked: Record<string, number>;
  };

  return {
    records: lastMessage as any as RecordType[],
    refreshRecords,
    connectionStatus,
    rtConnected,
  };
};

export default useRTRecords;
