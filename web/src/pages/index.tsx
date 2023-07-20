import { Card, Grid, Title } from "@tremor/react";
import { BrainCircuit, RadioTower } from "lucide-react";
import DigitalTwinsView from "~/components/home/digital-twins";
import SensorsView from "~/components/home/sensors";
import Layout from "~/components/layout";
import { Button } from "ui";
import Link from "next/link";

export default function Home() {
  return (
    <Layout title="Home">
      <Grid numItemsMd={2} className="gap-6">
        <Card>
          <div className="min-h-56">
            <div className="flex space-x-4">
              <RadioTower /> <Title>Sensors</Title>
            </div>
            <SensorsView numberOfItems={5} />
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
