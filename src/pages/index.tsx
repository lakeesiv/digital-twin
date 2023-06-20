import { Button } from "~/ui/button";
import Layout from "~/components/layout";
import {
  Card,
  Title,
  Text,
  Grid,
  Flex,
  Bold,
  List,
  ListItem,
  Icon,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import {
  RadioTower,
  XCircle,
  CheckCircle2,
  BrainCircuit,
  BatteryLow,
  Clock,
} from "lucide-react";
import { useState } from "react";

interface Sensor {
  status: "active" | "inactive";
  name: string;
  description: string;
  location: string;
}

const sensors: Sensor[] = [
  {
    status: "active",
    name: "Sensor 1",
    description: "This is a sensor",
    location: "Location 1",
  },
  {
    status: "active",
    name: "Sensor 2",
    description: "This is a sensor",
    location: "Location 2",
  },
  {
    status: "inactive",
    name: "Sensor 3",
    description: "This is a sensor",
    location: "Location 3",
  },
];

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [sensorTabIndex, setSensorTabIndex] = useState(0);

  return (
    <Layout title="Home">
      <Grid numItemsMd={2} className="mt-6 gap-6">
        <Card>
          <div className="min-h-56">
            <div className="flex space-x-4">
              <RadioTower /> <Title>Sensors</Title>
            </div>
            <TabGroup
              color="amber"
              index={sensorTabIndex}
              onIndexChange={(index) => setSensorTabIndex(index)}
            >
              <TabList className="mt-8">
                <Tab
                  icon={BatteryLow}
                  className={
                    sensorTabIndex === 0
                      ? "border-b-2 border-black text-black dark:border-gray-400 dark:text-gray-300"
                      : ""
                  }
                >
                  Low Battery
                </Tab>
                <Tab
                  icon={Clock}
                  className={
                    sensorTabIndex === 1
                      ? "border-b-2 border-black text-black dark:border-gray-400 dark:text-gray-300"
                      : ""
                  }
                >
                  Recently Updated
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <List className="mt-4">
                    {sensors.map((sensor) => (
                      <ListItem key={sensor.name}>
                        <Flex
                          justifyContent="start"
                          className="space-x-4 truncate"
                        >
                          {/* <icon /> */}
                          <Icon
                            className="rounded-md "
                            variant="light"
                            icon={
                              sensor.status === "active"
                                ? CheckCircle2
                                : XCircle
                            }
                            size="md"
                            color={sensor.status === "active" ? "green" : "red"}
                          />
                          <div className="truncate">
                            <Text className="truncate">
                              <Bold>{sensor.name}</Bold>
                            </Text>
                            <Text className="truncate">
                              {sensor.description}
                            </Text>
                          </div>
                        </Flex>
                        <Text>{sensor.location}</Text>
                      </ListItem>
                    ))}
                  </List>
                </TabPanel>
                <TabPanel>
                  <List className="mt-4">
                    {sensors.map((sensor) => (
                      <ListItem key={sensor.name}>
                        <Flex
                          justifyContent="start"
                          className="space-x-4 truncate"
                        >
                          {/* <icon /> */}
                          <Icon
                            className="rounded-md "
                            variant="light"
                            icon={
                              sensor.status === "active"
                                ? CheckCircle2
                                : XCircle
                            }
                            size="md"
                            color={sensor.status === "active" ? "blue" : "red"}
                          />
                          <div className="truncate">
                            <Text className="truncate">
                              <Bold>{sensor.name}</Bold>
                            </Text>
                            <Text className="truncate">
                              {sensor.description}
                            </Text>
                          </div>
                        </Flex>
                        <Text>{sensor.location}</Text>
                      </ListItem>
                    ))}
                  </List>
                </TabPanel>
              </TabPanels>
            </TabGroup>

            <Button
              href="/sensors"
              size="sm"
              variant="outline"
              className="mt-4"
            >
              View details
            </Button>
          </div>
        </Card>
        <Card>
          <div className="min-h-56">
            <div className="flex space-x-4">
              <BrainCircuit /> <Title>Digital Twins</Title>
            </div>
          </div>
        </Card>
      </Grid>
    </Layout>
  );
}
