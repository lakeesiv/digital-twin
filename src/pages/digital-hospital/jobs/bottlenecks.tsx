import { Card, Divider, Title } from "@tremor/react";
import dynamic from "next/dynamic";
import Layout from "~/components/layout";
import GridLayout from "~/components/layout/grid-layout";
import BottleNeckList, {
  mockBottleNeckData,
} from "~/components/twins/digital-hospital/bottlenecklist";
import type { BoneStationData } from "~/components/twins/digital-hospital/types";
import Data from "~/data.json";

const BarChart = dynamic(() => import("~/components/charts/bar"), {
  ssr: false,
});

const LineChart = dynamic(() => import("~/components/charts/line"), {
  ssr: false,
});

const BottlenecksPage = () => {
  const boneStationData = Data.bone_station as BoneStationData;

  return (
    <Layout title="Bottlenecks">
      <h1 className="text-3xl font-bold">Turn Around Times</h1>
      <GridLayout>
        <Card>
          <Title className="text-2xl">Percent Differences</Title>
          <Divider className="mb-0 mt-2" />
          <BottleNeckList data={mockBottleNeckData.data} />
        </Card>
        <BarChart
          {...mockBottleNeckData}
          extraBottomPadding={20}
          divId="tat-by-stage"
        ></BarChart>
      </GridLayout>
      <h1 className="mt-8 text-3xl font-bold">Resource Allocation by Time</h1>
      <GridLayout gridColumns={3}>
        <LineChart
          defaultCurveStyle="step"
          data={{
            x: boneStationData.busy.data.x,
            y: [boneStationData.busy.data.y],
          }}
          xlabel="Time (hours)"
          ylabel="Busy resources"
          labels={["Number of Resources"]}
          title="Busy Bone Station Resources"
          divId="bone-station-busy"
        />
        <LineChart
          defaultCurveStyle="step"
          data={{
            x: boneStationData.waiting.data.x,
            y: [boneStationData.waiting.data.y],
          }}
          xlabel="Time (hours)"
          ylabel="Waiting resources"
          labels={["Number of Resources"]}
          title="Waiting Bone Station Resources"
          divId="bone-station-wait"
        />
        <LineChart
          defaultCurveStyle="step"
          data={{
            x: boneStationData.busy.data.x,
            y: [boneStationData.busy.data.y],
          }}
          xlabel="Time (hours)"
          ylabel="Busy resources"
          labels={["Number of Resources"]}
          title="Busy Bone Station Resources"
          divId="bone-station-busy-1"
        />
        <LineChart
          defaultCurveStyle="step"
          data={{
            x: boneStationData.busy.data.x,
            y: [boneStationData.busy.data.y],
          }}
          xlabel="Time (hours)"
          ylabel="Busy resources"
          labels={["Number of Resources"]}
          title="Busy Bone Station Resources"
          divId="bone-station-busy-2"
        />
        <LineChart
          defaultCurveStyle="step"
          data={{
            x: boneStationData.busy.data.x,
            y: [boneStationData.busy.data.y],
          }}
          xlabel="Time (hours)"
          ylabel="Busy resources"
          labels={["Number of Resources"]}
          title="Busy Bone Station Resources"
          divId="bone-station-busy-3"
        />
        <LineChart
          defaultCurveStyle="step"
          data={{
            x: boneStationData.busy.data.x,
            y: [boneStationData.busy.data.y],
          }}
          xlabel="Time (hours)"
          ylabel="Busy resources"
          labels={["Number of Resources"]}
          title="Busy Bone Station Resources"
          divId="bone-station-busy-4"
        />
      </GridLayout>
    </Layout>
  );
};

export default BottlenecksPage;
