import { Badge } from "@tremor/react";
import { useCallback } from "react";
import Layout from "~/components/layout";
import { Button } from "~/ui/button";
import useRTWebSocket from "~/websockets/useRTWebSocket";

const WS = () => {
  const { messageHistory, sendJsonMessage, connectionStatus, rtConnected } =
    useRTWebSocket("wss://tfc-app9.cl.cam.ac.uk/rtmonitor/WS/mqtt_acp", {
      onConnect: () => {
        sendJsonMessage({
          msg_type: "rt_request",
          request_id: "A",
          options: ["latest_records"],
        });
      },
    });

  const handleOnRequestLastestMessage = useCallback(() => {
    sendJsonMessage({
      msg_type: "rt_request",
      request_id: "A",
      options: ["latest_msg"],
    });
  }, []);

  const handleOnRequestLatestRecords = useCallback(() => {
    sendJsonMessage({
      msg_type: "rt_request",
      request_id: "A",
      options: ["latest_records"],
    });
  }, []);

  const handleSubscribe = useCallback(() => {
    sendJsonMessage({
      msg_type: "rt_subscribe",
      request_id: "A",
    });
  }, []);

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: "Connecting",
  //   [ReadyState.OPEN]: "Connected",
  //   [ReadyState.CLOSING]: "Closing",
  //   [ReadyState.CLOSED]: "Closed",
  //   [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  // }[readyState];

  return (
    <Layout>
      <div>
        <div className="flex items-center space-x-2">
          {/* <Button
            onClick={handleClickSendMessage}
            disabled={connectionStatus === c}
          >
            RTConnect
          </Button> */}
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
            <span key={idx} className="whitespace-pre font-mono text-xs">
              {message ? JSON.stringify(message, null, 2) : null}
            </span>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default WS;
