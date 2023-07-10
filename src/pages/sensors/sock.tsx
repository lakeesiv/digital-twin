import { useCallback } from "react";
import Layout from "~/components/layout";
import WSStatus from "~/components/ws-status";
import { Button } from "~/ui/button";
import useWS from "~/websockets/useWS";

const WS = () => {
  const { messageHistory, sendJsonMessage, connectionStatus, rtConnected } =
    useWS("https://tfc-app9.cl.cam.ac.uk/rtmonitor/A/mqtt_acp", {
      onConnect: () => {
        console.log("onOpen");
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

  return (
    <Layout>
      <div>
        <div className="flex items-center space-x-2">
          <WSStatus
            connectionStatus={connectionStatus}
            rtConnected={rtConnected}
          />
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
          {messageHistory
            .slice(0)
            .reverse()
            .map((message, idx) => (
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
