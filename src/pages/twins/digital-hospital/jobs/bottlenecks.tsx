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
import RowOrGrid from "~/components/layout/row-or-grid";
import dynamic from "next/dynamic";
import type { BarGraphData } from "~/components/charts/bar";
import { roundToDP } from "~/utils";
import { ScrollArea } from "~/ui/scroll-area";

const BarChart = dynamic(() => import("~/components/charts/bar"), {
  ssr: false,
});

const BottlenecksPage = () => {
  return (
    <Layout title="Bottlenecks">
      <h1 className="text-3xl font-bold">Turn Around Times</h1>
      <RowOrGrid>
        <Card>
          <Title className="text-2xl">Percent Differences</Title>
          <Divider className="mb-0 mt-2" />
          <BottleNeckList data={barChartData.data} />
        </Card>
        <BarChart
          {...barChartData}
          extraBottomPadding={20}
          divId="tat-by-stage"
        ></BarChart>
      </RowOrGrid>
      <h1 className="mt-8 text-3xl font-bold">Resource Allocation by Time</h1>
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
    y: [
      [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
      [20, 18, 16, 14, 12, 10, 80, 12, 40, 20, 30],
    ],
    labels: ["Target", "Actual"],
  },
  xlabel: "Stages",
  ylabel: "TAT",
  title: "TAT by Stage",
};

interface BottleneckListProps {
  data: BarGraphData["data"];
}

const BottleNeckList: React.FC<BottleneckListProps> = ({ data }) => {
  const stages = data.x;
  if (!data.y) return null;
  if (!data.y[0]) return null;
  if (!data.y[1]) return null;
  if (!data.y[0][0]) return null;

  const percentIncrease = data.y[1].map((actual, index) => {
    const targets = data.y[0];
    const currentTarget = targets[index];
    return roundToDP(((actual - currentTarget) / currentTarget) * 100, 2);
  });

  // order by percetage decrease
  const sortedIndexes = percentIncrease
    .map((_, index) => index)
    .sort((a, b) => percentIncrease[b] - percentIncrease[a]);

  return (
    <ScrollArea className="h-[300px]">
      <List>
        {sortedIndexes.map((index) => (
          <BottleneckListItem
            key={stages[index]}
            target={data.y[0][index]}
            actual={data.y[1][index]}
            stage={stages[index]}
          />
        ))}
      </List>
    </ScrollArea>
  );
};

interface BottleneckListItemProps {
  target: number;
  actual: number;
  stage: string;
}
const BottleneckListItem: React.FC<BottleneckListItemProps> = ({
  target,
  actual,
  stage,
}) => {
  return (
    <ListItem>
      <div>
        <Title>{stage}</Title>
        <Text>
          Target: {target} | Actual: {actual}
        </Text>
      </div>
      <BadgeDelta
        deltaType={actual > target ? "increase" : "decrease"}
        className={
          actual > target
            ? "bg-red-500 text-red-100"
            : "bg-green-100 text-green-800"
        }
      >
        {roundToDP(((actual - target) / target) * 100, 1)} %
      </BadgeDelta>
    </ListItem>
  );
};

export default BottlenecksPage;
