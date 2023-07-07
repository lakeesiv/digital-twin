import Layout from "~/components/layout";
import { DataTable } from "~/components/sensors/data-table";
import { columns } from "~/components/sensors/columns";
// import data from "~/mock";
import useRTRecords from "~/websockets/useRTRecords";
import { Badge, Button } from "@tremor/react";

export default function Home() {
  const { records, refreshRecords, connectionStatus, rtConnected } =
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
      {records && records.length > 0 && (
        <DataTable
          columns={columns}
          data={records.map((record) => {
            return {
              id: record.acp_id,
              lastReading: record.payload_cooked,
              lastUpdateTimestamp: record.acp_ts,
              location: "Cambridge",
            };
          })}
          // data={data}
        />
      )}
    </Layout>
  );
}
