import { useRouter } from "next/router";
import Layout from "~/components/layout";
import LiveCharts from "~/components/sensors/live-charts";
import LiveMessageList from "~/components/sensors/live-message-list";
import WSStatus from "~/components/ws-status";
import useSubscribeById from "~/websockets/useSubscribeById";

function Page() {
  const router = useRouter();

  const { connectionStatus, rtConnected, messageHistory } = useSubscribeById(
    router.query.id as string | undefined
  );

  if (!router.query.id) {
    return null;
  }

  return (
    <Layout>
      <div className="flex items-center space-x-2">
        <WSStatus
          connectionStatus={connectionStatus}
          rtConnected={rtConnected}
        />
      </div>
      <LiveCharts sensorData={messageHistory} className="mt-4" />
      <LiveMessageList sensorData={messageHistory} className="mt-4" />
    </Layout>
  );
}

export default Page;
