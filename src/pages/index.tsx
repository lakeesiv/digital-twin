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
} from "@tremor/react";
import { RadioTower, XCircle, CheckCircle2 } from "lucide-react";

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

  return (
    <Layout title="Home">
      <Grid numItemsMd={2} className="mt-6 gap-6">
        <Card>
          <div className="min-h-56">
            <div className="flex space-x-4">
              <RadioTower /> <Title>Sensors</Title>
            </div>
            <List className="mt-4">
              {sensors.map((sensor) => (
                <ListItem key={sensor.name}>
                  <Flex justifyContent="start" className="space-x-4 truncate">
                    {/* <icon /> */}
                    <Icon
                      className="rounded-md "
                      variant="light"
                      icon={sensor.status === "active" ? CheckCircle2 : XCircle}
                      size="md"
                      color={sensor.status === "active" ? "green" : "red"}
                    />
                    <div className="truncate">
                      <Text className="truncate">
                        <Bold>{sensor.name}</Bold>
                      </Text>
                      <Text className="truncate">{sensor.description}</Text>
                    </div>
                  </Flex>
                  <Text>{sensor.location}</Text>
                </ListItem>
              ))}
            </List>
            <Button size="sm" variant="outline" className="mt-4">
              View details
            </Button>
          </div>
        </Card>
        <Card>
          <div className="h-56" />
        </Card>
      </Grid>
    </Layout>
  );
}
