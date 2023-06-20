import Layout from "~/components/layout";
import { DataTable } from "~/components/sensors/data-table";
import { columns } from "~/components/sensors/columns";
import type { SensorData } from "~/components/sensors/columns";
import { Card } from "@tremor/react";

const data: SensorData[] = [
  {
    id: "enl-iaqco3-0837d7",
    location: "IfM",
    lastUpdateTimestamp: "1686936000",
    lastReading: {
      bvoc: "1.402",
      co2_ppm: 442,
      co2e_ppm: "932.28",
      humidity: 40,
      iaq: 93,
      pressure_mbar: 1017,
      temperature: 24.1,
      acp_id: "enl-iaqco3-0837d7",
      acp_ts: 1686930000,
    },
  },
  {
    id: "enl-iaqco3-0837d7",
    location: "London",
    lastUpdateTimestamp: "1686990000",
    lastReading: {
      bvoc: "1.402",
      co2_ppm: 442,
      co2e_ppm: "932.28",
      humidity: 40,
      iaq: 93,
      pressure_mbar: 1017,
      temperature: 24.1,
      acp_id: "enl-iaqco3-0837d7",
      acp_ts: 1686930000,
    },
  },
  {
    id: "123",
    location: "Cambridge",
    lastUpdateTimestamp: "1686970700",
    lastReading: {
      bvoc: "1.402",
      co2_ppm: 442,
      co2e_ppm: "932.28",
      humidity: 40,
      iaq: 93,
      pressure_mbar: 1017,
      temperature: 24.1,
      acp_id: "enl-iaqco3-0837d7",
      acp_ts: 1686930000,
    },
  },
  {
    id: "test12",
    location: "London",
    lastUpdateTimestamp: "1685930000",
    lastReading: {
      bvoc: "1.402",
      co2_ppm: 442,
      co2e_ppm: "932.28",
      humidity: 40,
      iaq: 93,
      pressure_mbar: 1017,
      temperature: 24.1,
      acp_id: "enl-iaqco3-0837d7",
      acp_ts: 1686930000,
    },
  },
  {
    id: "enl-2",
    location: "IfM",
    lastUpdateTimestamp: "1683930000",
    lastReading: {
      bvoc: "1.402",
      co2_ppm: 442,
      co2e_ppm: "932.28",
      humidity: 40,
      iaq: 93,
      pressure_mbar: 1017,
      temperature: 24.1,
      acp_id: "enl-iaqco3-0837d7",
      acp_ts: 1686930000,
    },
  },
];

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout title="Home">
      <DataTable columns={columns} data={data} />
    </Layout>
  );
}
