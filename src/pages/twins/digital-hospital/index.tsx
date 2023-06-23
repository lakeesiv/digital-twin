import {
  Button,
  Callout,
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Title,
} from "@tremor/react";
import { Square, SquareStack } from "lucide-react";
import { useState } from "react";
import Layout from "~/components/layout";
import FileUploadMultiple from "~/components/twins/digital-hospital/fileinput";
import { Input } from "~/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";

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
            <Card className="px-8">
              <Title>Single File Upload</Title>
              <FileUploadMultiple />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="px-8">
              <Title>Multi File Upload</Title>
              <Callout
                title="Please name the files in the following format: 1.xlsx, 2.xlsx, 3.xlsx, 4.xlsx, 5.xlsx for the scenario number"
                className="my-4 bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200"
              ></Callout>
              <FileUploadMultiple multiple />
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <Card className="mt-4 flex flex-col space-y-4 p-8">
        <Title>Configurations</Title>
        <div className="flex items-center align-middle">
          <Text className="mr-2">Job Id/Name</Text>
          <Input className="w-56"></Input>
        </div>
        <div className="flex items-center align-middle">
          <Text className="mr-2">Number of Weeks</Text>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="1 Weeks" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <SelectItem key={item} value={String(item)}>
                  {item} Weeks
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button color="emerald">Run Simulation</Button>
      </Card>
    </Layout>
  );
}
