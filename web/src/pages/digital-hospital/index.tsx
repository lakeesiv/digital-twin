import { Card, Title, Text, Icon } from "@tremor/react";
import { Eye, Play } from "lucide-react";
import Link from "next/link";
import React from "react";
import Layout from "~/components/layout";

const Index = () => {
  return (
    <Layout title="Digital Hospital">
      <div className="flex h-full max-w-[800x] flex-col items-center space-y-8">
        <h1
          className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text pb-4 text-center text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl/[5rem]"
          style={{ animationDelay: "0.20s", animationFillMode: "forwards" }}
        >
          Digital Hospital
        </h1>
        <p
          className="mt-4 w-[900px] animate-fade-up text-center text-muted-foreground/80 opacity-0 md:text-xl"
          style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}
        >
          Welcome to the Digital Hospital Simulation Website. This website
          allows you to run simulations of the Histopathology lab. To get
          started, click on the "Run Simulation" button below. To view the
          results of previous simulations, click on the "View Results" button
          below.
        </p>

        <Card className="w-[400px] transform transition-transform duration-300 ease-in-out hover:scale-105">
          <Link href="/digital-hospital/simulate" className="flex space-x-4">
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
        <Card className="w-[400px] transform transition-transform duration-300 ease-in-out hover:scale-105">
          <Link href="/digital-hospital/jobs" className="flex space-x-4">
            <Icon
              color="blue"
              variant="solid"
              icon={Eye}
              className="h-12 w-12 items-center justify-center"
            />
            <div>
              <Title>View Results</Title>
              <Text>
                View the jobs that have been run and the results of the
                simulations
              </Text>
            </div>
          </Link>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
