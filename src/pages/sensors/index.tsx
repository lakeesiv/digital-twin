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
import { RadioTower, XCircle, CheckCircle2, BrainCircuit } from "lucide-react";

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

  return <Layout title="Home"></Layout>;
}
