import Layout from "~/components/layout";
import { DataTable } from "~/components/sensors/data-table";
import { columns } from "~/components/sensors/columns";
import type { SensorData } from "~/components/sensors/columns";
import { Card } from "@tremor/react";

const data: SensorData[] = [
  {
    id: "id_123",
    location: "IfM",
    lastUpdateTimestamp: "2021-01-01",
    lastReading: {
      temperature: 20,
      humidity: 50,
    },
  },
  {
    id: "id_456",
    location: "IfM",
    lastUpdateTimestamp: "2021-01-01",
    lastReading: {
      temperature: 20,
      humidity: 50,
    },
  },
];

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout title="Home">
      <Card>
        <DataTable columns={columns} data={data} />
      </Card>
    </Layout>
  );
}
