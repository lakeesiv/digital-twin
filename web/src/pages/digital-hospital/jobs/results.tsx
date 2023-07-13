import { Card, Divider, Title } from "@tremor/react";
import { BarChart, LineChart } from "charts";
import type { BarChartData } from "charts";
import type { LineChartData } from "charts";
import Layout from "~/components/layout";
import GridLayout from "~/components/layout/grid-layout";
import MetricsList from "~/components/twins/digital-hospital/metrics-list";
import BottleNeckList, {
  mockBottleNeckData,
} from "~/components/twins/digital-hospital/percentage-change-list";
import RCPathComparison from "~/components/twins/digital-hospital/rc-path-comparison";
import type { BoneStationData } from "~/components/twins/digital-hospital/types";
import Data from "~/data.json";

const ResultsPage = () => {
  const boneStationData = Data.bone_station as BoneStationData;

  return (
    <Layout title="Results">
      <h1 className="mb-4 text-3xl font-bold">Results</h1>
      <RCPathComparison />

      <div className="my-4">
        <Card className="px-4">
          <h1 className="text-2xl font-bold">Output Analysis</h1>
          <Divider className="mb-4 mt-2" />

          <Title>Turn Around Times (TAT) by Stage</Title>
          <GridLayout>
            <Card>
              <Title className="text-2xl">Percent Differences</Title>
              <Divider className="mb-0 mt-2" />
              <BottleNeckList data={mockBottleNeckData.data} />
            </Card>
            <BarChart
              {...mockBottleNeckData}
              extraBottomPadding={20}
              divId={"tat-by-stage"}
            ></BarChart>
          </GridLayout>
          <Title className="mt-8">Resource Allocation</Title>

          <GridLayout gridColumns={3}>
            <LineChart
              defaultCurveStyle="step"
              data={{
                x: [
                  boneStationData.busy.data.x,
                  boneStationData.waiting.data.x,
                ],
                y: [
                  boneStationData.busy.data.y,
                  boneStationData.waiting.data.y,
                ],
              }}
              xlabel="Time (hours)"
              ylabel="Busy resources"
              labels={["Busy", "Waiting"]}
              title="Bone Station Resources"
              divId={"bone-station-busy"}
              height={200}
              timeUnit={{
                current: "hour",
                target: "day",
                options: ["hour", "day", "week"],
              }}
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
              divId={"bone-station-wait"}
              height={200}
              timeUnit={{
                current: "hour",
                target: "day",
                options: ["hour", "day", "week"],
              }}
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
              divId={"bone-station-busy2"}
              height={200}
              timeUnit={{
                current: "hour",
                target: "day",
                options: ["hour", "day", "week"],
              }}
            />
          </GridLayout>
        </Card>

        <Card className="mt-4">
          <h1 className="text-2xl font-bold">Resource Utilization</h1>

          <GridLayout>
            <Card>
              <Title className="text-2xl">Percent Utilizations</Title>
              <Divider className="mb-0 mt-2" />
              <MetricsList data={resourceUtilizationMock.data} unit="%" />
            </Card>
            <BarChart
              {...resourceUtilizationMock}
              extraBottomPadding={20}
              divId={"percent-utilization"}
            />
          </GridLayout>

          <div className="mt-4">
            <LineChart
              defaultCurveStyle="linear"
              fill={false}
              {...lineChartData}
              divId="daily-utilization"
              height={600}
              timeUnit={{
                current: "day",
                target: "day",
                options: ["day", "week"],
              }}
            />
          </div>
        </Card>
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

const resourceUtilizationMock: BarChartData = {
  data: {
    x: stages,
    y: [[100, 50, 60, 60, 20, 100, 20, 24, 70, 80, 80, 90, 100]],
    labels: ["% Average Utilization"],
  },
  xlabel: "Stages",
  ylabel: "% Average Utilization",
  title: "% Average Utilization by Stage",
};
const randomArrayValues = (length: number) => {
  return Array.from({ length }, () => Math.random() * 100);
};

const lineChartData: LineChartData = {
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
  title: "Daily Utilization % by Stage",
  info: `Click on the Legend to toggle\nthe visibility of the lines`,
  visible: [true, true, true],
  labels: stages,
};

export default ResultsPage;
