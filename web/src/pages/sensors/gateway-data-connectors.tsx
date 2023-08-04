import Layout from "~/components/layout";
import { columns } from "~/components/sensors/gateway-data-connector/columns";
import { DataTable } from "~/components/sensors/data-table";
// import data from "~/mock";
import { getLatestDevices } from "~/api/sensor";

export default function Home() {
  const { data, loading, error } = getLatestDevices();

  return (
    <Layout>
      {data && data.length > 0 && (
        <DataTable
          columns={columns}
          data={data.map((record) => {
            return {
              id: record.acp_id,
              type:
                Math.random() < 0.5
                  ? "Gateway"
                  : ("Data Connector" as "Gateway" | "Data Connector"),
              lastReading: record.payload,
              lastUpdateTimestamp: record.acp_ts,
              location: "Cambridge",
            };
          })}
        />
      )}
      {loading && !error && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
    </Layout>
  );
}
