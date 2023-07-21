import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

export type WebSocketMessage = {
  msg_type: "rt_connect" | "rt_connect_ok" | "rt_data" | "feed_mqtt";
  request_data?: {
    acp_id: string;
    acp_ts: string;
    payload_cooked: { [key: string]: number };
  }[];
};

export type ParsedMessage = {
  msg_type: string;
  acp_id: string;
  acp_ts: string;
  payload: { [key: string]: number };
};

type WebSocketResponse = ParsedMessage[] | ParsedMessage;

interface Options {
  onConnect?: () => void;
  condition?: boolean;
}

const useWS = (url: string, options?: Options) => {
  const socket =
    url.startsWith("ws") || url.startsWith("wss")
      ? new WebSocket(url) // if url starts with ws or wss, use WebSocket
      : new SockJS(url); // else use SockJS
  const [messageHistory, setMessageHistory] = useState<object[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "Connected" | "Disconnected" | "Uninstantiated"
  >("Uninstantiated");
  const [rtConnected, setRtConnected] = useState(false);

  const sendMessage = (message: string) => {
    socket.send(message);
  };

  const sendJsonMessage = (message: object) => {
    socket.send(JSON.stringify(message));
  };

  useEffect(() => {
    // if condition is false, don't connect
    if (options?.condition !== undefined) {
      if (!options.condition) return;
    }

    socket.onopen = () => {
      setConnectionStatus("Connected");
      if (!rtConnected) {
        // send connect message
        sendJsonMessage({
          msg_type: "rt_connect",
        });
      }
    };

    socket.onmessage = (event: { data: string }) => {
      const data = JSON.parse(event.data) as WebSocketMessage;
      let parsedData = data as WebSocketResponse;

      if (data.msg_type === "rt_connect_ok" && !rtConnected) {
        setRtConnected(true); // set rtConnected to true
        options?.onConnect?.(); // run onConnect function if it exists
        return; // don't add rt_connect_ok to message history so return
      }

      if (data.msg_type === "feed_mqtt" || data.msg_type === "rt_data") {
        if (!data.request_data) return; // if request_data is undefined, return (shouldn't happen)

        parsedData = data.request_data.map((d) => ({
          msg_type: data.msg_type,
          acp_id: d.acp_id,
          acp_ts: d.acp_ts,
          payload: d.payload_cooked,
        }));

        if (parsedData.length === 1) {
          parsedData = parsedData[0];
        }
      }

      setMessageHistory((prev) => [...prev, parsedData]);
    };

    socket.onclose = () => {
      setConnectionStatus("Disconnected");
      setRtConnected(false);
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

export default useWS;
