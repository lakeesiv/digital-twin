import {
  ListItem,
  Flex,
  Icon,
  Text,
  List,
  Bold,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import {
  ArrowUpRight,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  Clock,
} from "lucide-react";
import Link from "next/link";
import React from "react";
// import data from "~/mock";

type TabViewItem = {
  name: string;
  description: string;
  location: string;
  battery: number;
  timestamp: number;
};

interface TabViewProps {
  data: TabViewItem[];
}

const BatteryIcon = ({ battery }: { battery: number }) => {
  type Colors = "red" | "yellow" | "orange" | "green";
  const iconMap = {
    veryLow: BatteryWarning,
    low: BatteryLow,
    medium: BatteryMedium,
    high: BatteryFull,
  };

  const colorMap: Record<keyof typeof iconMap, Colors> = {
    veryLow: "red",
    low: "orange",
    medium: "yellow",
    high: "green",
  };
  let status = "low" as keyof typeof iconMap;

  if (battery < 10) {
    status = "veryLow";
  } else if (battery < 30) {
    status = "low";
  } else if (battery < 60) {
    status = "medium";
  } else {
    status = "high";
  }

  return (
    <Icon
      className={`rounded-md`}
      variant="light"
      icon={iconMap[status]}
      color={colorMap[status]}
      size="md"
    />
  );
};

const TabView: React.FC<TabViewProps> = ({ data }) => {
  return (
    <List className="mt-4">
      {data.map((sensor) => (
        <ListItem key={sensor.name}>
          <Flex justifyContent="start" className="space-x-4 truncate">
            <BatteryIcon battery={sensor.battery} />
            <div className="truncate">
              <Link href={`/sensors/${sensor.name}`}>
                <div className="flex  items-center space-x-2 text-blue-500 dark:text-blue-500 ">
                  <Text className=" font-mono text-blue-500 dark:text-blue-500">
                    {sensor.name}
                  </Text>
                  <ArrowUpRight size={18} />
                </div>
              </Link>
              <Text className="truncate">{sensor.description}</Text>
            </div>
          </Flex>
          <Text>{new Date(sensor.timestamp * 1000).toLocaleString()}</Text>
        </ListItem>
      ))}
    </List>
  );
};

interface SensorsViewProps {
  lowBatteryData: TabViewItem[];
  recentlyUpdatedData: TabViewItem[];
  numberOfItems?: number;
}

const SensorsView: React.FC<SensorsViewProps> = ({
  lowBatteryData,
  recentlyUpdatedData,
  numberOfItems = 5,
}) => {
  const [sensorTabIndex, setSensorTabIndex] = React.useState(0);

  // sort low battery data (ascending)
  lowBatteryData.sort((a, b) => a.battery - b.battery);
  // sort recently updated data (descending)
  recentlyUpdatedData.sort((a, b) => b.timestamp - a.timestamp);

  // limit the number of items
  lowBatteryData = lowBatteryData.slice(0, numberOfItems);
  recentlyUpdatedData = recentlyUpdatedData.slice(0, numberOfItems);

  return (
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
          <TabView data={lowBatteryData} />
        </TabPanel>
        <TabPanel>
          <TabView data={recentlyUpdatedData} />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
};

export default SensorsView;
