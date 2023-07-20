import { useCallback } from "react";
import { REQUEST_ID, SOCK_JS_URL } from "./config";
import useWS from "./useWS";
export type RecordType = {
  acp_id: string;
  acp_ts: string;
  payload: Record<string, number>;
};

const useRecords = () => {
  const {
    lastMessage,
    sendJsonMessage,
    connectionStatus,
    rtConnected,
    messageHistory,
  } = useWS(SOCK_JS_URL, {
    onConnect: () => {
      // get all latest records
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

  return {
    records: lastMessage as any as RecordType[],
    refreshRecords,
    connectionStatus,
    rtConnected,
    messageHistory,
  };
};

export default useRecords;
