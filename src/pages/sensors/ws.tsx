import { Badge } from "@tremor/react";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Layout from "~/components/layout";
import { Button } from "~/ui/button";

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
  const [messageHistory, setMessageHistory] = useState<object[]>([]);
  const [rtConnected, setRtConnected] = useState<boolean>(false);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    // "ws://129.169.50.112:8083/rtmonitor/WS/mqtt_csn"
    "wss://tfc-app9.cl.cam.ac.uk/rtmonitor/WS/mqtt_acp"
  );

  useEffect(() => {
    const handleLastMessage = async () => {
      if (lastMessage !== null) {
        const lastMessageDataBlob = lastMessage?.data as Blob;
        const text = await blobToText(lastMessageDataBlob);

        const jsonPayload = JSON.parse(text) as {
          msg_type: string;
        };

        if (jsonPayload.msg_type === "rt_connect_ok") {
          setRtConnected(true);
        }

        setMessageHistory((prev) => [...prev, jsonPayload]);
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

  const handleOnRequestLastestMessage = useCallback(() => {
    sendMessage(
      JSON.stringify({
        msg_type: "rt_request",
        request_id: "A",
        options: ["latest_msg"],
      })
    );
  }, []);

  const handleOnRequestLatestRecords = useCallback(() => {
    sendMessage(
      JSON.stringify({
        msg_type: "rt_request",
        request_id: "A",
        options: ["latest_records"],
      })
    );
  }, []);

  const handleSubscribe = useCallback(() => {
    sendMessage(
      JSON.stringify({
        msg_type: "rt_subscribe",
        request_id: "A",
      })
    );
  }, []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <Layout>
      <div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleClickSendMessage}
            disabled={readyState !== ReadyState.OPEN}
          >
            RTConnect
          </Button>
          <Badge color={connectionStatus === "Connected" ? "lime" : "red"}>
            WS: {connectionStatus}
          </Badge>
          <Badge color={rtConnected ? "lime" : "red"}>
            RT: {rtConnected ? "Connected" : "Disconnected"}
          </Badge>
          {rtConnected && (
            <>
              <Button onClick={handleOnRequestLastestMessage}>
                Req Latest
              </Button>
              <Button onClick={handleOnRequestLatestRecords}>
                Req Records
              </Button>
              <Button onClick={handleSubscribe}>Subscribe</Button>
            </>
          )}
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          {messageHistory.map((message, idx) => (
            <span key={idx}>{message ? JSON.stringify(message, null, 2) : null}</span>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default WS;
