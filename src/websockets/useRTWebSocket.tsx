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
  msg_type: string;
  request_data?: {
    acp_id: string;
    acp_ts: string;
    payload_cooked: { [key: string]: number };
  }[];
};

type WebSocketResponse = WebSocketMessage | WebSocketMessage[];

type WebSocketOptions = {
  url: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

const useRTWebSocket = (url: string, options?: WebSocketOptions) => {
  const [messageHistory, setMessageHistory] = useState<WebSocketResponse[]>([]);
  const [rtConnected, setRtConnected] = useState<boolean>(false);
  const { onConnect } = options || {};

  const { sendMessage, sendJsonMessage, lastMessage, readyState } =
    useWebSocket(url);

  useEffect(() => {
    const handleLastMessage = async () => {
      if (lastMessage !== null) {
        const lastMessageDataBlob = lastMessage?.data as Blob;
        const text = await blobToText(lastMessageDataBlob);

        const jsonPayload = JSON.parse(text) as WebSocketMessage;
        let res = jsonPayload as WebSocketResponse;

        if (jsonPayload.msg_type === "rt_connect_ok") {
          setRtConnected(true);
          onConnect?.();
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
      }
    };
    handleLastMessage().catch((e) => console.error(e));
  }, [lastMessage, setMessageHistory, onConnect]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !rtConnected) {
      sendJsonMessage({
        msg_type: "rt_connect",
        client_data: {
          rt_client_name: "Socket Client",
          rt_client_id: "socket_client",
          rt_client_url:
            "https://tfc-app4.cl.cam.ac.uk/backdoor/socket-client/index.html",
          rt_token: "888",
        },
      });
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
  }[readyState];

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
