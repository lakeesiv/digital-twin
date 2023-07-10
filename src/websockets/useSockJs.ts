import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

type WebSocketMessage = {
  msg_type: "rt_connect" | "rt_connect_ok" | "rt_data" | "feed_mqtt";
  request_data?: {
    acp_id: string;
    acp_ts: string;
    payload_cooked: { [key: string]: number };
  }[];
};

type WebSocketResponse = WebSocketMessage | WebSocketMessage[];

interface Options {
  onConnect?: () => void;
  condition?: boolean;
}

const useSockJs = (url: string, options?: Options) => {
  const socket = new SockJS(url);
  const [messageHistory, setMessageHistory] = useState<object[]>([]);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [rtConnected, setRtConnected] = useState(false);

  const sendMessage = (message: string) => {
    socket.send(message);
  };

  const sendJsonMessage = (message: object) => {
    socket.send(JSON.stringify(message));
  };

  useEffect(() => {
    if (options?.condition !== undefined) {
      if (!options.condition) return;
    }

    socket.onopen = () => {
      setConnectionStatus(true);
      if (!connectionStatus) {
        sendJsonMessage({
          msg_type: "rt_connect",
        });
      }
    };

    socket.onmessage = (event: { data: string }) => {
      // setMessageHistory((prev) => [...prev, event.data]);

      const jsonPayload = JSON.parse(event.data) as WebSocketMessage;
      let res = jsonPayload as WebSocketResponse;

      if (jsonPayload.msg_type === "rt_connect_ok" && !rtConnected) {
        setRtConnected(true);
        options?.onConnect?.();
        return;
      }

      if (
        jsonPayload.msg_type === "feed_mqtt" ||
        jsonPayload.msg_type === "rt_data"
      ) {
        const payload = jsonPayload as {
          msg_type: string;
          request_data: {
            acp_id: string;
            acp_ts: string;
            payload_cooked: { [key: string]: number };
          }[];
        };

        res = payload.request_data.map((d) => ({
          msg_type: jsonPayload.msg_type,
          acp_id: d.acp_id,
          acp_ts: d.acp_ts,
          payload_cooked: d.payload_cooked,
        }));
      }

      setMessageHistory((prev) => [...prev, res]);
    };

    socket.onclose = () => {
      console.log("Socket closed");
    };
  }, [options?.condition]);

  return {
    messageHistory,
    sendMessage,
    sendJsonMessage,
    lastMessage: messageHistory[messageHistory.length - 1],
    connectionStatus,
    rtConnected,
  };
};

export default useSockJs;
