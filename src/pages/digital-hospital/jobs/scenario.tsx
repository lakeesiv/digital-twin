import {
  Card,
  Divider,
  List,
  ListItem,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Title,
} from "@tremor/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import type { BarGraphData } from "~/components/charts/bar";
import type { LineGraphData } from "~/components/charts/line";
import Layout from "~/components/layout";
import GridLayout from "~/components/layout/grid-layout";
import BottleNeckList, {
  mockBottleNeckData,
} from "~/components/twins/digital-hospital/bottlenecklist";
import { Badge } from "~/ui/badge";
import { ScrollArea } from "~/ui/scroll-area";
import { roundToDP } from "~/utils";

const BarChart = dynamic(() => import("~/components/charts/bar"), {
  ssr: false,
});

const LineChart = dynamic(() => import("~/components/charts/line"), {
  ssr: false,
});

const ScenarioPage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Layout title="Scenario Analysis">
      <h1 className="text-3xl font-bold">Lab Metrics</h1>
      <GridLayout>
        <Card>
          <Title className="text-2xl">Percent Utilizations</Title>
          <Divider className="mb-0 mt-2" />
          <UtilizationList data={barChartData.data} />
        </Card>
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
      </GridLayout>
      <GridLayout className="mt-4">
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
      </GridLayout>
      <h1 className="mt-8 text-3xl font-bold">Individual Scenario Metrics</h1>
      <div className="mt-4">
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
          <TabPanels>
            <TabPanel>
              <Card className="px-4">
                <Title>Turn Around Times (TAT)</Title>
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
              </Card>
            </TabPanel>
            <TabPanel>
              <Card className="px-8">
                <Title>Multi File Upload</Title>
              </Card>
            </TabPanel>
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
      <Badge>{roundToDP(percentile, 2)} hr</Badge>
    </ListItem>
  );
};

export default ScenarioPage;
