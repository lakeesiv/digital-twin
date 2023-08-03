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
import type { BarChartData, LineChartData } from "charts";
import { BarChart, LineChart } from "charts";
import { useState } from "react";
import Layout from "~/components/layout";
import GridLayout from "~/components/layout/grid-layout";
import LabTAT from "~/components/twins/digital-hospital/lab-tat";
import MetricsList from "~/components/twins/digital-hospital/metrics-list";
import BottleNeckList, {
  mockBottleNeckData,
} from "~/components/twins/digital-hospital/percentage-change-list";
import RCPathComparison from "~/components/twins/digital-hospital/rc-path-comparison";
import type { BoneStationData } from "~/components/twins/digital-hospital/types";
import Data from "~/data.json";

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
            error: [[5, 5, 5, 5, 5]],
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
            labels: [
              "Scenario 1",
              "Scenario 2",
              "Scenario 3",
              "Scenario 4",
              "Scenario 5",
            ],
          }}
          xlabel="Days"
          ylabel="Daily Utilization %"
          title="Daily Utilization %"
          divId="daily-utilization-per-scenario"
          height={300}
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
                  <RCPathComparison />
                  <LabTAT className="mt-4" />

                  <h1 className="mt-4 text-2xl font-bold">Output Analysis</h1>
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
                      divId={"tat-by-stage" + String(i)}
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
                        labels: ["Busy", "Waiting"],
                      }}
                      xlabel="Time (hours)"
                      ylabel="Busy resources"
                      title="Busy Bone Station Resources"
                      divId={"bone-station-busy" + String(i)}
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
                        labels: ["Number of Resources"],
                      }}
                      xlabel="Time (hours)"
                      ylabel="Waiting resources"
                      title="Waiting Bone Station Resources"
                      divId={"bone-station-wait" + String(i)}
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
                        labels: ["Number of Resources"],
                      }}
                      xlabel="Time (hours)"
                      ylabel="Busy resources"
                      title="Busy Bone Station Resources"
                      divId={"bone-station-busy2" + String(i)}
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
                      <MetricsList
                        data={resourceUtilizationMock.data}
                        unit="%"
                      />
                    </Card>
                    <BarChart
                      {...resourceUtilizationMock}
                      extraBottomPadding={20}
                      divId={"percent-utilization" + String(i)}
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
    labels: stages,
  },
  xlabel: "Days",
  ylabel: "Daily Utilization %",
  title: "Daily Utilization % by Stage",
  info: `Click on the Legend to toggle\nthe visibility of the lines`,
  visible: [true, true, true],
};

export default ScenarioPage;
