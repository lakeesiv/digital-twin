import { ListItem, Flex, List, Text, Button } from "@tremor/react";
import { ArrowUpRight, Box, Square } from "lucide-react";
import Link from "next/link";

const twins = [
  {
    name: "TwinAir",
    description: "Air quality digital twin",
    id: "twinair",
  },
  {
    name: "Digital Hospital",
    description: "Digital Twin of Histopathology Lab at Addenbrooke's Hospital",
    id: "digital-hospital",
  },
];

const DigitalTwinsView: React.FC = () => {
  return (
    <List className="mt-4">
      {twins.map((twin) => (
        <ListItem key={twin.name}>
          <Flex justifyContent="start" className="space-x-4 truncate">
            {/* <BatteryIcon battery={sensor.battery} /> */}
            <div className="truncate">
              <Link href={`/twins/${twin.id}`}>
                <div className="flex  items-center space-x-2 text-blue-500 dark:text-blue-500 ">
                  <Text className=" font-mono text-blue-500 dark:text-blue-500">
                    {twin.name}
                  </Text>
                  <ArrowUpRight size={18} />
                </div>
              </Link>
              <Text className="truncate">{twin.description}</Text>
            </div>
          </Flex>
          <div className="flex justify-center space-x-2">
            <Button size="xs" icon={Square}>
              2D
            </Button>
            <Button size="xs" icon={Box}>
              3D
            </Button>
          </div>
        </ListItem>
      ))}
    </List>
  );
};

export default DigitalTwinsView;
