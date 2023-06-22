import React from "react";
import type { BoneStationData } from "./types";
import LineChart from "~/components/charts/line";
import { Card, Metric, ProgressBar, Grid, Text } from "@tremor/react";
import { roundToDP } from "~/utils";
import RowOrGrid from "~/components/layout/row-or-grid";
import dynamic from "next/dynamic";

const PlotlyChartNoSSR = dynamic(
  () => import("~/components/charts/plotly-base"),
  {
    ssr: false,
  }
);

interface BoneStationProps {
  data: BoneStationData;
}

const BoneStation = ({ data }: BoneStationProps) => {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Bone Station</h1>
      <div className="flex flex-col space-y-5">
        <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
          <Card key="mean-bus">
            <Text>Mean Busy</Text>
            <Metric>{roundToDP(data.metrics.mean_busy, 2)}</Metric>
          </Card>
          <Card key="util">
            <Text>Mean Scheduled</Text>
            <Metric>{roundToDP(data.metrics.mean_scheduled, 2)}</Metric>
          </Card>
          <Card key="util">
            <Text>Utilization</Text>
            <Metric>{roundToDP(data.metrics.utilization * 100, 2)}%</Metric>
            <ProgressBar
              value={data.metrics.utilization * 100}
              className="mt-4 dark:bg-gray-800"
            />
          </Card>
        </Grid>
        <RowOrGrid>
          <PlotlyChartNoSSR defaultCurveStyle="step" {...data.busy} />
          <PlotlyChartNoSSR defaultCurveStyle="step" {...data.waiting} />
        </RowOrGrid>
      </div>
    </div>
  );
};

export default BoneStation;
