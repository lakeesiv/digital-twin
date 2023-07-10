import useRTWebSocket from "./useRTWebSocket";
import { REQUEST_ID, WS_URL } from "./config";

const useSubscribeById = (id: string) => {
  const filter = [
    {
      key: "acp_id",
      test: "in",
      value: [id],
    },
  ];

  const { lastMessage, sendJsonMessage, connectionStatus, rtConnected } =
    useRTWebSocket(WS_URL, {
      onConnect: () => {
        // get latest message from the WS
        sendJsonMessage({
          msg_type: "rt_request",
          request_id: REQUEST_ID,
          options: ["latest_msg"],
          filters: filter,
        });

        // subscribe to the WS
        sendJsonMessage({
          msg_type: "rt_subscribe",
          request_id: REQUEST_ID,
          filters: filter,
        });
      },
    });

  return {
    lastMessage,
    sendJsonMessage,
    connectionStatus,
    rtConnected,
  };
};

export default useSubscribeById;
