import dynamic from "next/dynamic";
import Data from "~/data.json";
import Layout from "~/components/layout";
import { BoneStationData } from "~/components/twins/digital-hospital/types";

const PlotlyChartNoSSR = dynamic(
  () => import("~/components/charts/plotly-base"),
  {
    ssr: false,
  }
);

export default function Home() {
  const boneStationData = Data.bone_station as BoneStationData;

  return (
    <Layout title="Digital Twin">
      <a href="/twins/digital-hospital/resources">Link</a>
      <PlotlyChartNoSSR {...boneStationData.busy} />
    </Layout>
  );
}
