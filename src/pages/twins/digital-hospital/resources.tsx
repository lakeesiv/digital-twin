import Layout from "~/components/layout";
import Data from "~/data.json";
import BoneStation from "~/components/twins/digital-hospital/bone-station";

type GraphingData = {
  title: string;
  xlabel: string;
  ylabel: string;
  data: {
    x: number[];
    y: number[];
  };
};

type BoneStationData = {
  busy: GraphingData;
  waiting: GraphingData;
  metrics: {
    mean_busy: number;
    mean_scheduled: number;
    utilization: number;
  };
};

export default function Home() {
  const boneStationData = Data.bone_station as BoneStationData;
  return (
    <Layout title="Digital Twin">
      <BoneStation data={boneStationData} />
    </Layout>
  );
}
