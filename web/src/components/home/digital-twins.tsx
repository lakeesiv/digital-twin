import { ListItem, Flex, List, Text, Button, Icon } from "@tremor/react";
import { ActivitySquare, ArrowUpRight, Box, Cloud, Square } from "lucide-react";
import Link from "next/link";
import { DHStatus, SensorStatus } from "./status";

const twins = [
  // {
  //   name: "TwinAir",
  //   description: "Air quality digital twin",
  //   id: "twinair",
  //   icon: Cloud,
  // },
  {
    name: "Digital Hospital",
    description: "Digital Twin of the Histopathology Lab",
    id: "digital-hospital",
    icon: ActivitySquare,
  },
];

const DigitalTwinsView: React.FC = () => {
  return (
    <List className="mt-4">
      {twins.map((twin) => (
        <ListItem key={twin.name}>
          <Flex justifyContent="start" className="space-x-4 ">
            {/* <BatteryIcon battery={sensor.battery} /> */}
            <Icon icon={twin.icon} variant="light" className="p-2" />
            <div className="truncate">
              <Link href={`/${twin.id}`}>
                <div className="flex  items-center space-x-2 text-blue-500 dark:text-blue-500 ">
                  <Text className=" font-mono text-blue-500 dark:text-blue-500">
                    {twin.name}
                  </Text>
                  <ArrowUpRight size={18} />
                </div>
              </Link>
              <span className="truncate">{twin.description}</span>
            </div>
          </Flex>
        </ListItem>
      ))}
      <div className="flex flex-col pt-4">
        <SensorStatus />
        <DHStatus />
      </div>
    </List>
  );
};

export default DigitalTwinsView;
