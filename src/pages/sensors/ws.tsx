import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Layout from "~/components/layout";

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

const WS = () => {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://129.169.50.112:8083/rtmonitor/WS/mqtt_csn"
  );

  useEffect(() => {
    const handleLastMessage = async () => {
      if (lastMessage !== null) {
        const lastMessageDataBlob = lastMessage?.data as Blob;
        const text = await blobToText(lastMessageDataBlob);
        console.log(text);
        setMessageHistory((prev) => [...prev, text]);
      }
    };
    handleLastMessage().catch((e) => console.error(e));
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback(
    () =>
      sendMessage(
        JSON.stringify({
          msg_type: "rt_connect",
          client_data: {
            rt_client_name: "Socket Client",
            rt_client_id: "socket_client",
            rt_client_url:
              "https://tfc-app4.cl.cam.ac.uk/backdoor/socket-client/index.html",
            rt_token: "888",
          },
        })
      ),
    []
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <Layout>
      <div>
        <button
          onClick={handleClickSendMessage}
          disabled={readyState !== ReadyState.OPEN}
        >
          Click Me to send 'Hello'
        </button>
        <span>The WebSocket is currently {connectionStatus}</span>
        {lastMessage ? (
          <span>Last message: {String(lastMessage.data)}</span>
        ) : null}
        <ul>
          {messageHistory.map((message, idx) => (
            <span key={idx}>{message ? String(message) : null}</span>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default WS;
