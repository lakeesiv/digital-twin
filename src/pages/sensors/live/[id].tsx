import { useRouter } from "next/router";
import Layout from "~/components/layout";
import LiveCharts from "~/components/sensors/live-charts";
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
      <div>
        <div className="flex items-center space-x-2">
          <WSStatus
            connectionStatus={connectionStatus}
            rtConnected={rtConnected}
          />
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

        <LiveCharts sensorData={messageHistory} />
      </div>
    </Layout>
  );
}

export default Page;
