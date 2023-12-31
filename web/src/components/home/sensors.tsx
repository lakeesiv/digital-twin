import {
  Flex,
  Icon,
  List,
  ListItem,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
} from "@tremor/react";
import { ArrowUpRight, BatteryLow, Clock, Radio } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SensorData, getLatestDevices } from "~/api/sensor";

interface TabViewProps {
  data: FilteredData[];
}

const TabView: React.FC<TabViewProps> = ({ data }) => {
  return (
    <List className="mt-4">
      {data.map((sensor) => (
        <ListItem key={sensor.name}>
          <Flex justifyContent="start" className="space-x-4 truncate">
            <Icon
              className={`rounded-md`}
              variant="light"
              icon={Radio}
              size="md"
            />
            <div className="truncate">
              <Link href={`/sensors/live/${sensor.name}`}>
                <div className="flex  items-center space-x-2 text-blue-500 dark:text-blue-500 ">
                  <Text className=" font-mono text-blue-500 dark:text-blue-500">
                    {sensor.name}
                  </Text>
                  <ArrowUpRight size={18} />
                </div>
              </Link>
              <Text className="truncate">
                {sensor.location} {sensor.description ? " | " : ""}
                {sensor.description}
              </Text>
            </div>
          </Flex>
          <Text>{new Date(sensor.timestamp * 1000).toLocaleString()}</Text>
        </ListItem>
      ))}
    </List>
  );
};

interface SensorsViewProps {
  numberOfItems?: number;
}

const SensorsView: React.FC<SensorsViewProps> = ({ numberOfItems = 5 }) => {
  const [sensorTabIndex, setSensorTabIndex] = React.useState(0);

  const { data, error, loading } = getLatestDevices();

  if (loading) {
    return <div className="mt-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="mt-4">Error: Please ensure Sensor server is running</div>
    );
  }

  const { lowBatteryData, recentlyUpdatedData } = filterData(
    data,
    numberOfItems
  );
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

type FilteredData = {
  name: string;
  description?: string;
  location: string;
  timestamp: number;
};

const filterData = (data: SensorData[], numOfItems: number) => {
  const lowBatteryData: FilteredData[] = [];
  const recentlyUpdatedData: FilteredData[] = [];

  // lowBatteryData filtering
  let dataWithVdd = data.filter((item) => item.payload?.batt_mv !== undefined);
  // sort data by vdd (asc)
  dataWithVdd.sort((a, b) => a.payload.batt_mv - b.payload.batt_mv);
  // get the first numOfItems
  dataWithVdd = dataWithVdd.slice(0, numOfItems);
  // map to FilteredData
  dataWithVdd.forEach((item) => {
    lowBatteryData.push({
      name: item.acp_id,
      description: `Battery: ${item.payload.batt_mv} mV`,
      location: "Cambridge", // TODO
      timestamp: item.acp_ts,
    });
  });

  // recentlyUpdatedData filtering
  // sort data by timestamp (desc)
  data.sort((a, b) => b.acp_ts - a.acp_ts);
  // get the first numOfItems
  data = data.slice(0, numOfItems);
  // map to FilteredData
  data.forEach((item) => {
    recentlyUpdatedData.push({
      name: item.acp_id,
      location: "Cambridge", // TODO
      timestamp: item.acp_ts,
    });
  });

  return {
    lowBatteryData,
    recentlyUpdatedData,
  };
};

export default SensorsView;
