import { Card, Divider, List, ListItem, Text, Title } from "@tremor/react";
import dynamic from "next/dynamic";
import React from "react";
import type { BarGraphData } from "~/components/charts/bar";
import type { LineGraphData } from "~/components/charts/line";
import Layout from "~/components/layout";
import GridLayout from "~/components/layout/grid-layout";
import { Badge } from "~/ui/badge";
import { ScrollArea } from "~/ui/scroll-area";
import { roundToDP } from "~/utils";

const BarChart = dynamic(() => import("~/components/charts/bar"), {
  ssr: false,
});

const LineChart = dynamic(() => import("~/components/charts/line"), {
  ssr: false,
});

const UtilizationPage = () => {
  return (
    <Layout title="Resource Utilization">
      <h1 className="text-3xl font-bold">Average Resource Utilization</h1>
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
        />
      </GridLayout>
      <h1 className="mt-8 text-3xl font-bold"> Daily Utilization</h1>
      <div className="mt-4">
        <LineChart
          defaultCurveStyle="linear"
          fill={false}
          {...lineChartData}
          divId="daily-utilization"
          height={600}
        />
        <BarChart
          {...barChartData2}
          extraBottomPadding={20}
          divId="bar-daily-util"
          stacked
        />
      </div>
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

const randomArrayValues = (length: number) => {
  return Array.from({ length }, () => Math.random() * 100);
};
const lineChartData: LineGraphData = {
  data: {
    x: [...Array(18).keys()],
    y: [
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
    ],
  },
  xlabel: "Days",
  ylabel: "Daily Utilization %",
  title: "Daily Utilization % (Click on legend to toggle)",
  visible: [true, true, true],
  labels: stages,
};

const barChartData2: BarGraphData = {
  data: {
    x: [...Array(18).keys()],
    y: [
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
      randomArrayValues(18),
    ],
    labels: stages,
  },
  xlabel: "Days",
  ylabel: "Daily Utilization %",
  title: "Daily Utilization % (Click on legend to toggle)",
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
  stage: string | number;
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
