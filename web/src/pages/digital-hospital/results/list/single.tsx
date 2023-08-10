import {
  Button,
  Callout,
  Card,
  Icon,
  ProgressBar,
  Text,
  Title,
} from "@tremor/react";
import { ArrowUpRight, Square } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { ScenarioListItem, listScenarios } from "~/api/digital-hospital";
import Layout from "~/components/layout";
import StatusBage from "~/components/status-badge";

const REFRESH_INTERVAL = 1000 * 1;

interface JobPageProps {
  jobsList: ScenarioListItem[];
  error: boolean;
}

export const getServerSideProps = async (): Promise<{
  props: JobPageProps;
}> => {
  try {
    const jobsList = await listScenarios();
    return {
      props: {
        jobsList,
        error: false,
      },
    };
  } catch (error) {
    return {
      props: {
        jobsList: [],
        error: true,
      },
    };
  }
};

const JobsPage = ({ jobsList, error }: JobPageProps) => {
  const router = useRouter();

  // Trigger a refresh by calling getServerSideProps when router changes
  // This is a hacky way to refresh the data every x seconds
  const refreshData = () => {
    router.replace(router.asPath);
    console.log("REFRESING DATA");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // order by timestamp
  jobsList.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Layout title="Jobs">
      {error ? (
        <Callout
          className="mt-8"
          title="There was an error fetching the jobs list. 
			  Please ensure that the Simulation Server is running and try again
			."
        />
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <h1
            className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text pb-4 text-center text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm "
            style={{ animationDelay: "0.20s", animationFillMode: "forwards" }}
          >
            Results
          </h1>
          <p
            className="my-4 w-[900px] animate-fade-up text-center text-muted-foreground/80 opacity-0 md:text-xl"
            style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}
          >
            Click on the results button to view the results of a job
          </p>
          {jobsList.map((job) => (
            <JobsEntry
              key={job.id}
              jobId={String(job.id)}
              percentage={job.progress * 100}
              timestamp={job.timestamp * 1000}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

interface JobsEntryProps {
  jobId: string;
  percentage: number;
  timestamp: number;
}

const JobsEntry: React.FC<JobsEntryProps> = ({
  jobId,
  percentage,
  timestamp,
}) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const status = percentage === 100 ? "completed" : "in-progress";
  const date = new Date(timestamp);
  return (
    <Card className="max-w-[460px]">
      <div className="flex items-center space-x-4">
        <Icon
          icon={Square}
          color={status === "completed" ? "emerald" : "orange"}
          size="lg"
          variant="solid"
        ></Icon>
        <div>
          {status === "completed" ? (
            <Title className="font-mono">
              {date.toLocaleDateString("en-GB")}{" "}
              {date.toLocaleTimeString("en-GB")}
            </Title>
          ) : (
            <Title className="font-mono">In Progress</Title>
          )}
          {status === "completed" ? (
            <Text className="text-xs">Job Id: {jobId}</Text>
          ) : (
            <StatusBage
              message="Job In Progress"
              status="active"
              color="yellow"
            />
          )}
        </div>
        <div className="flex items-center space-x-6 pl-8">
          {status === "completed" && (
            <a href={"/digital-hospital/results/single?id=" + jobId}>
              <Button icon={ArrowUpRight} size="xs">
                Results
              </Button>
            </a>
          )}
        </div>
      </div>
      {status === "in-progress" && (
        <div className="mt-8">
          <ProgressBar value={percentage} className="mt-1 w-full" />
        </div>
      )}
    </Card>
  );
};

export default JobsPage;
