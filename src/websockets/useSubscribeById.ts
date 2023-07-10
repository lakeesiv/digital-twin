import { REQUEST_ID, SOCK_JS_URL } from "./config";
import useWS, { type ParsedMessage } from "./useWS";

const useSubscribeById = (id: string | undefined) => {
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
  } = useWS(SOCK_JS_URL, {
    onConnect: () => {
      // request latest records
      sendJsonMessage({
        msg_type: "rt_request",
        request_id: REQUEST_ID,
        options: ["latest_records"],
        filters: filter,
      });

      // subscribe to new records
      sendJsonMessage({
        msg_type: "rt_subscribe",
        request_id: REQUEST_ID,
        filters: filter,
      });
    },
    condition: id !== undefined, // only connect when id is defined
  });

  return {
    lastMessage: lastMessage as ParsedMessage,
    sendJsonMessage,
    connectionStatus,
    rtConnected,
    messageHistory: messageHistory as ParsedMessage[],
  };
};

export default useSubscribeById;
