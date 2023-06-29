import {
  Card,
  Divider,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Title,
} from "@tremor/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { BarGraphData } from "~/components/charts/bar";
import type { LineGraphData } from "~/components/charts/line";
import Layout from "~/components/layout";
import GridLayout from "~/components/layout/grid-layout";
import BottleNeckList, {
  mockBottleNeckData,
} from "~/components/twins/digital-hospital/bottlenecklist";
import MetricsList from "~/components/twins/digital-hospital/metrics-list";
import type { BoneStationData } from "~/components/twins/digital-hospital/types";
import Data from "~/data.json";

const BarChart = dynamic(() => import("~/components/charts/bar"), {
  ssr: false,
});

const LineChart = dynamic(() => import("~/components/charts/line"), {
  ssr: false,
});

const ScenarioPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const boneStationData = Data.bone_station as BoneStationData;

  return (
    <Layout title="Scenario Analysis">
      <h1 className="text-3xl font-bold">Lab Metrics</h1>
      <GridLayout>
        {/* <Card>
          <Title className="text-2xl">Lab TAT for Scenario</Title>
          <Divider className="mb-0 mt-2" />
          <MetricsList data={barChartData.data} order="asc" unit="hr" />
        </Card> */}
        <BarChart
          extraBottomPadding={20}
          divId="tat-by-stage"
          data={{
            x: [
              "Scenario 1",
              "Scenario 2",
              "Scenario 3",
              "Scenario 4",
              "Scenario 5",
            ],
            y: [[30, 20, 60, 70, 50]],
            labels: ["TAT"],
          }}
          xlabel="Scenarios"
          ylabel="Lab TAT for Scenario"
          title="Lab TAT for Scenario"
        />
        <BarChart
          data={{
            x: [
              "Scenario 1",
              "Scenario 2",
              "Scenario 3",
              "Scenario 4",
              "Scenario 5",
            ],
            y: [[80, 80, 60, 70, 90]],
            labels: ["% Utilization"],
          }}
          xlabel="Scenarios"
          ylabel="% Utilization"
          title="Mean Utilization for Scenario "
          extraBottomPadding={20}
          divId="mean-ultization-by-stage"
        />
      </GridLayout>
      <div className="mt-4">
        <LineChart
          fill={false}
          data={{
            x: [1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
            y: [
              [55, 93, 77, 58, 73, 91, 90, 70, 52, 92],
              [78, 64, 97, 51, 57, 84, 73, 95, 76, 84],
              [71, 63, 68, 84, 87, 89, 95, 61, 89, 76],
              [98, 77, 67, 92, 70, 92, 62, 96, 56, 91],
              [58, 56, 68, 89, 80, 73, 66, 93, 79, 82],
            ],
          }}
          labels={[
            "Scenario 1",
            "Scenario 2",
            "Scenario 3",
            "Scenario 4",
            "Scenario 5",
          ]}
          xlabel="Days"
          ylabel="Daily Utilization %"
          title="Daily Utilization %"
          divId="daily-utilization"
        />
      </div>
      <h1 className="mt-12 text-3xl font-bold">Individual Scenario Metrics</h1>
      <div className="my-4">
        <TabGroup
          index={tabIndex}
          onIndexChange={(index) => {
            setTabIndex(index);
          }}
        >
          <TabList variant="solid">
            {[...Array(5).keys()].map((i) => (
              <Tab
                key={i}
                className={
                  tabIndex === i
                    ? "border-[1px] border-gray-200 bg-white text-black dark:border-black dark:bg-background dark:text-gray-300"
                    : ""
                }
              >
                Scenario {i + 1}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="my-4">
            {[...Array(5).keys()].map((i) => (
              <TabPanel key={i}>
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
                      divId="tat-by-stage"
                    ></BarChart>
                  </GridLayout>
                  <Title className="mt-8">Resource Allocation</Title>

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
                </Card>

                <Card className="mt-4">
                  <h1 className="text-2xl font-bold">Resource Utilization</h1>

                  <GridLayout>
                    <Card>
                      <Title className="text-2xl">Percent Utilizations</Title>
                      <Divider className="mb-0 mt-2" />
                      <MetricsList
                        data={resourceUtilizationMock.data}
                        unit="%"
                      />
                    </Card>
                    <BarChart
                      {...resourceUtilizationMock}
                      extraBottomPadding={20}
                      divId="percent-utilization"
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
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
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

const resourceUtilizationMock: BarGraphData = {
  data: {
    x: stages,
    y: [[100, 50, 60, 60, 20, 100, 20, 24, 70, 80, 80, 90, 100]],
    labels: ["% Utilization"],
  },
  xlabel: "Stages",
  ylabel: "% Utilization",
  title: "% Utilization by Stage",
};

const barChartData: BarGraphData = {
  data: {
    x: ["Scenario 1", "Scenario 2", "Scenario 3", "Scenario 4", "Scenario 5"],
    y: [[30, 20, 60, 70, 50]],
    labels: ["% Utilization"],
  },
  xlabel: "Scenarios",
  ylabel: "TAT for Scenario",
  title: "TAT for Scenario",
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
  title: "Daily Utilization % [Click on legend to toggle]",
  visible: [true, true, true],
  labels: stages,
};

// const barChartData2: BarGraphData = {
//   data: {
//     x: [...Array(18).keys()],
//     y: [
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//       randomArrayValues(18),
//     ],
//     labels: stages,
//   },
//   xlabel: "Days",
//   ylabel: "Daily Utilization %",
//   title: "Daily Utilization % (Click on legend to toggle)",
// };

export default ScenarioPage;
