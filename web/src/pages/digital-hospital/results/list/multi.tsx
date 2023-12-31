import {
  Button,
  Callout,
  Card,
  Icon,
  ProgressBar,
  Text,
  Title,
} from "@tremor/react";
import { ArrowUpRight, Square, SquareStack } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Suspense, useEffect } from "react";
import {
  MultScenarioListItem,
  ScenarioListItem,
  listMultiScenarios,
  listScenarios,
} from "~/api/digital-hospital";
import Layout from "~/components/layout";
import StatusBage from "~/components/status-badge";

const REFRESH_INTERVAL = 1000 * 1;

interface JobPageProps {
  jobsList: MultScenarioListItem[];
  error: boolean;
}

export const getServerSideProps = async (): Promise<{
  props: JobPageProps;
}> => {
  try {
    const jobsList = await listMultiScenarios();
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
  jobsList.sort((a, b) => b.created - a.created);

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
        <div className="flex-col items-center space-y-4">
          <h1
            className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text pb-4 text-center text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm "
            style={{ animationDelay: "0.20s", animationFillMode: "forwards" }}
          >
            Results
          </h1>

          {jobsList.map((job) => (
            <JobsEntry
              key={job.analysis_id}
              jobId={String(job.analysis_id)}
              type="scenario"
              percentage={job.progress * 100}
              timestamp={job.created * 1000}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

interface JobsEntryProps {
  jobId: string;
  type: "process" | "scenario";
  percentage: number;
  timestamp: number;
}

const JobsEntry: React.FC<JobsEntryProps> = ({
  jobId,
  type,
  percentage,
  timestamp,
}) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const status = percentage === 100 ? "completed" : "in-progress";
  const date = new Date(timestamp);
  return (
    <Card>
      <div className="flex items-center space-x-4">
        <Icon
          icon={type === "scenario" ? SquareStack : Square}
          color={status === "completed" ? "emerald" : "orange"}
          size="lg"
          variant="solid"
        ></Icon>
        <div>
          <Title className="font-mono">Job {jobId}</Title>
          {status === "completed" ? (
            <Text className="text-xs">
              {date.toLocaleDateString("en-GB")}{" "}
              {date.toLocaleTimeString("en-GB")}
            </Text>
          ) : (
            <StatusBage
              message="Job In Progress"
              status="active"
              color="yellow"
            />
          )}
        </div>
        <div className="flex items-center space-x-6 pl-8">
          {type === "process" && status === "completed" && (
            <a href={"/digital-hospital/results/multi?id=" + jobId}>
              <Button icon={ArrowUpRight} size="xs">
                Results
              </Button>
            </a>
          )}
          {type === "scenario" && status === "completed" && (
            <a href={"/digital-hospital/results/multi?id=" + jobId}>
              <Button icon={ArrowUpRight} size="xs">
                Results (Scenario Analysis)
              </Button>
            </a>
          )}
          {status === "in-progress" && (
            <div className="flex items-center space-x-4">
              <ProgressBar value={percentage} className="mt-1 w-80" />
            </div>
          )}
        </div>
      </div>
      {/* {status === "in-progress" && (
        <Callout
          className="mt-8"
          title="Please wait around 20 mins for the job to complete"
        />
      )} */}
    </Card>
  );
};

export default JobsPage;
