import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

async function blobToText(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      resolve(text);
    };

    reader.onerror = () => {
      reject(new Error("Error reading blob as text."));
    };

    reader.readAsText(blob);
  });
}

type WebSocketMessage = {
  msg_type: "rt_connect" | "rt_connect_ok" | "rt_data" | "feed_mqtt";
  request_data?: {
    acp_id: string;
    acp_ts: string;
    payload_cooked: { [key: string]: number };
  }[];
};

type WebSocketResponse = WebSocketMessage | WebSocketMessage[];

type WebSocketOptions = {
  onConnect?: () => void;
  condition?: boolean;
};

const useRTWebSocket = (url: string, options?: WebSocketOptions) => {
  const [messageHistory, setMessageHistory] = useState<WebSocketResponse[]>([]);
  const [rtConnected, setRtConnected] = useState<boolean>(false);
  const { onConnect } = options || {};

  const { sendMessage, sendJsonMessage, lastMessage, readyState } =
    useWebSocket(url);

  useEffect(() => {
    const handleLastMessage = async () => {
      if (lastMessage == null) return;

      if (options?.condition !== undefined) {
        if (!options.condition) return;
      }

      const lastMessageDataBlob = lastMessage?.data as Blob;
      const text = await blobToText(lastMessageDataBlob);

      const jsonPayload = JSON.parse(text) as WebSocketMessage;
      let res = jsonPayload as WebSocketResponse;

      if (jsonPayload.msg_type === "rt_connect_ok" && !rtConnected) {
        setRtConnected(true);
        onConnect?.();
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
    handleLastMessage().catch((e) => console.error(e));
  }, [lastMessage, setMessageHistory, options?.condition]);

  useEffect(() => {
    const rtConnectMessage = {
      msg_type: "rt_connect",
    };
    if (readyState === ReadyState.OPEN && !rtConnected) {
      sendJsonMessage(rtConnectMessage);
    }
    if (readyState === ReadyState.CLOSED) {
      setRtConnected(false);
    }
  }, [readyState]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState] as
    | "Connecting"
    | "Connected"
    | "Closing"
    | "Closed"
    | "Uninstantiated";

  return {
    sendMessage,
    sendJsonMessage,
    messageHistory,
    rtConnected,
    connectionStatus,
    lastMessage: messageHistory[messageHistory.length - 1],
  };
};

export default useRTWebSocket;
