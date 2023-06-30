import { Card, Divider, Title } from "@tremor/react";
import { Info } from "lucide-react";
import dynamic from "next/dynamic";
import type { BarChartData } from "~/components/charts/bar";
import type { LineChartData } from "~/components/charts/line";
import Layout from "~/components/layout";
import GridLayout from "~/components/layout/grid-layout";
import MetricsList from "~/components/twins/digital-hospital/metrics-list";
import BottleNeckList, {
  mockBottleNeckData,
} from "~/components/twins/digital-hospital/percentage-change-list";
import type { BoneStationData } from "~/components/twins/digital-hospital/types";
import Data from "~/data.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/ui/tooltip";

const BarChart = dynamic(() => import("~/components/charts/bar"), {
  ssr: false,
});

const LineChart = dynamic(() => import("~/components/charts/line"), {
  ssr: false,
});

const ScenarioPage = () => {
  const boneStationData = Data.bone_station as BoneStationData;

  return (
    <Layout title="Scenario Analysis">
      <h1 className="text-3xl font-bold">Results</h1>
      <div className="my-4">
        <Card className="px-4">
          <h1 className="text-2xl font-bold">Bottlenecks</h1>
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
    labels: ["% Utilization"],
  },
  xlabel: "Stages",
  ylabel: "% Utilization",
  title: "% Utilization by Stage",
};
const randomArrayValues = (length: number) => {
  return Array.from({ length }, () => Math.random() * 100);
};

const TextWithInfo = ({ text, info }: { text: string; info: string }) => {
  return (
    <div className="flex flex-row justify-center">
      <p>{text}</p>
      <div className="ml-4 mt-[1.5px]">
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger>
              <Info
                className="h-6 w-6 text-gray-500 hover:text-gray-700
				dark:text-gray-300 dark:hover:text-gray-400"
              />
            </TooltipTrigger>
            <TooltipContent>
              <span
                className="whitespace-pre-wrap text-sm text-gray-500
				dark:text-gray-300
				"
              >
                {info}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
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
  title: (
    <TextWithInfo
      text="Daily Utilization"
      info={`Click on the Legend to toggle\nthe visibility of the lines`}
    />
  ),
  visible: [true, true, true],
  labels: stages,
};

export default ScenarioPage;