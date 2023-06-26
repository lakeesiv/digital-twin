import { Card, Title, Text, Icon } from "@tremor/react";
import { Eye, Play } from "lucide-react";
import Link from "next/link";
import React from "react";
import Layout from "~/components/layout";

const Index = () => {
  return (
    <Layout title="Digital Hospital">
      <div className="flex h-full w-full space-x-12  ">
        <Card className="transform transition-transform duration-300 ease-in-out hover:scale-105">
          <Link href="/twins/digital-hospital/jobs" className="flex space-x-4">
            <Icon
              color="blue"
              variant="solid"
              icon={Eye}
              className="h-12 w-12 items-center justify-center"
            />
            <div>
              <Title>View Jobs</Title>
              <Text>
                View the jobs that have been run and the results of the
                simulations
              </Text>
            </div>
          </Link>
        </Card>
        <Card className="transform transition-transform duration-300 ease-in-out hover:scale-105">
          <Link
            href="/twins/digital-hospital/simulate"
            className="flex space-x-4"
          >
            <Icon
              color="red"
              variant="solid"
              icon={Play}
              className="h-12 w-12 items-center justify-center"
            />
            <div>
              <Title>Run Simulation</Title>
              <Text>
                Run a simulation of the Histopathology lab for a given number of
                weeks
              </Text>
            </div>
          </Link>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
