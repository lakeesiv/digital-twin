import { Card, Grid, Title } from "@tremor/react";
import { BrainCircuit, RadioTower } from "lucide-react";
import DigitalTwinsView from "~/components/home/digital-twins";
import SensorsView from "~/components/home/sensors";
import Layout from "~/components/layout";
import data from "~/mock";
import { Button } from "ui";
import Link from "next/link";

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
            <SensorsView
              numberOfItems={5}
              lowBatteryData={data.map((sensor) => ({
                name: sensor.id,
                description: `${sensor.location} | ${sensor.lastReading.battery}% `,
                location: sensor.location,
                battery: sensor.lastReading.battery,
                timestamp: parseInt(sensor.lastUpdateTimestamp),
              }))}
              recentlyUpdatedData={data.map((sensor) => ({
                name: sensor.id,
                description: `${sensor.location} | ${sensor.lastReading.battery}%`,
                location: sensor.location,
                battery: sensor.lastReading.battery,
                timestamp: parseInt(sensor.lastUpdateTimestamp),
              }))}
            />
            <Button size="sm" variant="outline" className="mt-4">
              <Link href="/sensors" passHref>
                View details
              </Link>
            </Button>
          </div>
        </Card>
        <Card>
          <div className="min-h-56">
            <div className="flex space-x-4">
              <BrainCircuit /> <Title>Digital Twins</Title>
            </div>
            <DigitalTwinsView />
          </div>
        </Card>
      </Grid>
    </Layout>
  );
}
