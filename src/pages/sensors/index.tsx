import Layout from "~/components/layout";
import { columns } from "~/components/sensors/columns";
import { DataTable } from "~/components/sensors/data-table";
// import data from "~/mock";
import WSStatus from "~/components/ws-status";
import useRTRecords from "~/websockets/useRTRecords";

export default function Home() {
  const { records, connectionStatus, rtConnected } = useRTRecords();

  return (
    <Layout title="Home">
      <div className="mb-2 flex items-center space-x-2">
        <WSStatus
          connectionStatus={connectionStatus}
          rtConnected={rtConnected}
        />
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
