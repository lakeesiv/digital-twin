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
import React from "react";
import { ScenarioListItem, listScenarios } from "~/api/digital-hospital";
import Layout from "~/components/layout";
import StatusBage from "~/components/status-badge";

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
        <div className="space-y-4">
          {jobsList.map((job) => (
            <JobsEntry
              key={job.id}
              jobId={String(job.id)}
              type="process"
              percentage={job.progress * 100}
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
}

const JobsEntry: React.FC<JobsEntryProps> = ({ jobId, type, percentage }) => {
  const status = percentage === 100 ? "completed" : "in-progress";
  return (
    <Card>
      <div className="flex items-center space-x-4">
        <Icon
          icon={type === "scenario" ? SquareStack : Square}
          variant="solid"
          color={status === "completed" ? "emerald" : "orange"}
          size="lg"
        ></Icon>
        <div>
          <Title className="font-mono">Job {jobId}</Title>
          {status === "completed" ? (
            <Text className="text-xs">2021-05-01 12:00:00</Text>
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
            <Link href={"/digital-hospital/jobs/results?id=" + jobId}>
              <Button icon={ArrowUpRight} size="xs">
                Results
              </Button>
            </Link>
          )}
          {type === "scenario" && status === "completed" && (
            <Link href={"/digital-hospital/jobs/scenario?id=" + jobId}>
              <Button icon={ArrowUpRight} size="xs">
                Results (Scenario Analysis)
              </Button>
            </Link>
          )}
          {status === "in-progress" && (
            <div className="flex items-center space-x-4">
              <ProgressBar value={percentage} className="mt-1 w-80" />
            </div>
          )}
        </div>
      </div>
      {status === "in-progress" && (
        <Callout
          className="mt-8"
          title="Please wait around 20 mins for the job to complete"
        />
      )}
    </Card>
  );
};

export default JobsPage;
