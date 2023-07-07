import Layout from "~/components/layout";
import { DataTable } from "~/components/sensors/data-table";
import { columns } from "~/components/sensors/columns";
import data from "~/mock";
import useRTRecords from "~/websockets/useRTRecords";
import { Badge, Button } from "@tremor/react";

export default function Home() {
  const { history, refreshRecords, connectionStatus, rtConnected } =
    useRTRecords();

  return (
    <Layout title="Home">
      <div className="mb-2 flex items-center space-x-2">
        <Badge color={connectionStatus === "Connected" ? "lime" : "red"}>
          WS: {connectionStatus}
        </Badge>
        <Badge color={rtConnected ? "lime" : "red"}>
          RT: {rtConnected ? "Connected" : "Disconnected"}
        </Badge>
        <Button size="xs" onClick={refreshRecords}>
          Refresh
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </Layout>
  );
}
