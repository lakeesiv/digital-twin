import useRTWebSocket from "./useRTWebSocket";
import { REQUEST_ID, WS_URL } from "./config";

const useSubscribeById = (id: string) => {
  const filter = [
    {
      key: "acp_id",
      test: "=",
      value: id,
    },
  ];

  const {
    lastMessage,
    sendJsonMessage,
    connectionStatus,
    rtConnected,
    messageHistory,
  } = useRTWebSocket(WS_URL, {
    onConnect: () => {
      // get latest message from the WS

      const latestRecordsMessaage = {
        msg_type: "rt_request",
        request_id: REQUEST_ID,
        options: ["latest_records"],
        filters: filter,
      };

      console.log("Sending latest records message", latestRecordsMessaage);

      sendJsonMessage(latestRecordsMessaage);

      const subscriptionMessage = {
        msg_type: "rt_subscribe",
        request_id: REQUEST_ID,
        filters: filter,
      };

      console.log("Sending subscription message", subscriptionMessage);

      // subscribe to the WS
      sendJsonMessage(subscriptionMessage);
    },
    condition: id !== undefined,
    keepAlive: true,
  });

  return {
    lastMessage,
    sendJsonMessage,
    connectionStatus,
    rtConnected,
    messageHistory,
  };
};

export default useSubscribeById;
