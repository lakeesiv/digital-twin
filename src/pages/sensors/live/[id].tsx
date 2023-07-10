import Layout from "~/components/layout";
import { useRouter } from "next/router";
// import Chart from "~/components/chart";
import useSubscribeById from "~/websockets/useSubscribeById";
import WSStatus from "~/components/ws-status";

function Home() {
  const router = useRouter();

  const {
    // lastMessage,
    // sendJsonMessage,
    connectionStatus,
    rtConnected,
    messageHistory,
  } = useSubscribeById(router.query.id as string);

  if (!router.query.id) {
    return <div>Missing id</div>;
  }

  return (
    <Layout>
      <div>
        <div className="flex items-center space-x-2">
          <WSStatus
            connectionStatus={connectionStatus ? "Connected" : "Closed"}
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
      </div>
    </Layout>
  );
}

export default Home;
