import {
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import { Square, SquareStack } from "lucide-react";
import { useState } from "react";
import Layout from "~/components/layout";
import FileUploadMultiple from "~/components/twins/digital-hospital/fileinput";
export default function Home() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Layout title="Digital Twin">
      <TabGroup
        color="amber"
        index={tabIndex}
        onIndexChange={(index) => setTabIndex(index)}
      >
        <TabList variant="solid">
          <Tab
            icon={Square}
            className={
              tabIndex === 0
                ? "border-[1px] border-gray-200 bg-white text-black dark:border-black dark:bg-background dark:text-gray-300"
                : ""
            }
          >
            Single Simulation
          </Tab>
          <Tab
            icon={SquareStack}
            className={
              tabIndex === 1
                ? "border-[1px] border-gray-200 bg-white text-black dark:border-black dark:bg-background dark:text-gray-300"
                : ""
            }
          >
            Scenario Analysis
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card className="p-40">
              <FileUploadMultiple />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="p-40" />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Layout>
  );
}
