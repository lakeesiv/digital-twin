import React from "react";
import type { BoneStationData } from "./types";
import { Card, Metric, ProgressBar, Grid, Text } from "@tremor/react";
import { roundToDP } from "~/utils";
import RowOrGrid from "~/components/layout/row-or-grid";
import dynamic from "next/dynamic";

const LineChart = dynamic(() => import("~/components/charts/line"), {
  ssr: false,
});

const BarChart = dynamic(() => import("~/components/charts/bar"), {
  ssr: false,
});

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
          <LineChart
            defaultCurveStyle="step"
            data={{ x: data.busy.data.x, y: [data.busy.data.y] }}
            xlabel="Time (hours)"
            ylabel="Number of patients"
            labels={["Number of patients"]}
            title="Number of patients over time"
            divId="bone-station-busy"
          />
          <BarChart
            data={{
              labels: ["Target", "Actual"],
              y: [
                [1, 2],
                [1, 4],
                [1, 5],
              ],
              x: ["Monday", "Tuesday", "Wednesday"],
            }}
            xlabel="Day of the week"
            ylabel="Number of patients"
            title="Number of patients per day of the week"
            divId="bone-station-days"
          />
          <LineChart
            defaultCurveStyle="step"
            data={{ x: data.busy.data.x, y: [data.busy.data.y] }}
            xlabel="Time (hours)"
            ylabel="Number of patients"
            labels={["Number of patients"]}
            title="Number of patients over time"
            divId="bone-station-busy-4"
          />
          <BarChart
            data={{
              labels: ["Target", "Actual"],
              y: [
                [1, 2],
                [1, 4],
                [1, 5],
              ],
              x: ["Monday", "Tuesday", "Wednesday"],
            }}
            xlabel="Day of the week"
            ylabel="Number of patients"
            title="Number of patients per day of the week"
            divId="bone-station-days-2"
          />
        </RowOrGrid>
      </div>
    </div>
  );
};

export default BoneStation;
