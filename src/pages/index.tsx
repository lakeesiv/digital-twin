import { Card, Grid, Title } from "@tremor/react";
import { BrainCircuit, RadioTower } from "lucide-react";
import SensorsView from "~/components/home/sensors";
import Layout from "~/components/layout";
import data from "~/mock";
import { Button } from "~/ui/button";

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
