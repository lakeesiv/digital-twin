import Layout from "~/components/layout";
import Data from "~/data.json";
import LineChart from "~/components/charts/line";

type GraphingData = {
  title: string;
  xlabel: string;
  ylabel: string;
  data: {
    x: number[];
    y: number[];
  };
};

export default function Home() {
  const busyData = Data.bone_station.busy as GraphingData;
  return (
    <Layout title="Digital Twin">
      <LineChart defaultCurveStyle="step" {...busyData} />
    </Layout>
  );
}
