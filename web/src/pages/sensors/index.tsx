import Layout from "~/components/layout";
import { columns } from "~/components/sensors/columns";
import { DataTable } from "~/components/sensors/data-table";
// import data from "~/mock";
import WSStatus from "~/components/ws-status";
import useRecords from "~/websockets/useRecords";

export default function Home() {
  const { records, connectionStatus, rtConnected } = useRecords();

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
              lastReading: record.payload,
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
