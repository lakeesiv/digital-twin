import Layout from "~/components/layout";
import Data from "~/data.json";
import LineChart from "~/components/charts/line";
import { Card, Metric, ProgressBar, Grid, Text } from "@tremor/react";
import { roundToDP } from "~/utils";

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
      <div className="flex flex-col space-y-5">
        <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
          <Card key="mean-bus">
            <Text>Mean Busy</Text>
            <Metric>{roundToDP(boneStationData.metrics.mean_busy, 2)}%</Metric>
          </Card>
          <Card key="util">
            <Text>Mean Scheduled</Text>
            <Metric>
              {roundToDP(boneStationData.metrics.mean_scheduled, 2)}%
            </Metric>
          </Card>
          <Card key="util">
            <Text>Utilization</Text>
            <Metric>
              {roundToDP(boneStationData.metrics.utilization * 100, 2)}%
            </Metric>
            <ProgressBar
              value={boneStationData.metrics.utilization * 100}
              className="mt-4 dark:bg-gray-800"
            />
          </Card>
        </Grid>
        <LineChart defaultCurveStyle="step" {...boneStationData.busy} />
        <LineChart defaultCurveStyle="step" {...boneStationData.waiting} />
      </div>
    </Layout>
  );
}
