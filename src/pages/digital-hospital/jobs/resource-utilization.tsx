import {
  Card,
  List,
  ListItem,
  Title,
  Text,
  Divider,
  BadgeDelta,
} from "@tremor/react";
import React from "react";
import Layout from "~/components/layout";
import GridLayout from "~/components/layout/grid-layout";
import dynamic from "next/dynamic";
import type { BarGraphData } from "~/components/charts/bar";
import { roundToDP } from "~/utils";
import { ScrollArea } from "~/ui/scroll-area";
import Data from "~/data.json";
import type { BoneStationData } from "~/components/twins/digital-hospital/types";
import { Badge } from "~/ui/badge";

const BarChart = dynamic(() => import("~/components/charts/bar"), {
  ssr: false,
});

const LineChart = dynamic(() => import("~/components/charts/line"), {
  ssr: false,
});

const UtilizationPage = () => {
  const boneStationData = Data.bone_station as BoneStationData;

  return (
    <Layout title="Resoruce Utilization">
      <h1 className="text-3xl font-bold">Resource Utilization</h1>
      <GridLayout>
        <Card>
          <Title className="text-2xl">Percent Utilizations</Title>
          <Divider className="mb-0 mt-2" />
          <UtilizationList data={barChartData.data} />
        </Card>
        <BarChart
          {...barChartData}
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

const stages = [
  "Reception",
  "Cutup",
  "Processing",
  "Embedding",
  "Microtomy",
  "Staining",
  "Cover slipping",
  "Scanning",
  "Collation",
  "QC",
  "Allocation",
  "Reporting",
  "Dispatch",
];

const barChartData: BarGraphData = {
  data: {
    x: stages,
    y: [[100, 50, 60, 60, 20, 100, 20, 24, 70, 80, 80, 90, 100]],
    labels: ["% Utilization"],
  },
  xlabel: "Stages",
  ylabel: "% Utilization",
  title: "% Utilization by Stage",
};

interface UtilizationListProps {
  data: BarGraphData["data"];
}

const UtilizationList: React.FC<UtilizationListProps> = ({ data }) => {
  const stages = data.x;

  const percentIncrease = data.y[0];

  // order by percetage decrease
  const sortedIndexes = percentIncrease
    .map((_, index) => index)
    .sort((a, b) => percentIncrease[b] - percentIncrease[a]);

  return (
    <ScrollArea className="h-[300px]">
      <List>
        {sortedIndexes.map((index) => (
          <UtlizationItem
            key={stages[index]}
            percentile={data.y[0][index]}
            stage={stages[index]}
          />
        ))}
      </List>
    </ScrollArea>
  );
};

interface UtlizationItemProps {
  percentile: number;
  stage: string;
}
const UtlizationItem: React.FC<UtlizationItemProps> = ({
  percentile,
  stage,
}) => {
  return (
    <ListItem>
      <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        {stage}
      </Text>
      <Badge>{roundToDP(percentile, 2)} %</Badge>
    </ListItem>
  );
};

export default UtilizationPage;
