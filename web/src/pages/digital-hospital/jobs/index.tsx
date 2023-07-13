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
import Layout from "~/components/layout";
import StatusBage from "~/components/status-badge";

const JobsPage = () => {
  return (
    <Layout title="Jobs">
      <div className="space-y-4">
        <JobsEntry title="job-3" status="in-progress" type="process" />
        <JobsEntry title="job-2" status="completed" type="process" />
        <JobsEntry title="job-1" status="completed" type="scenario" />
      </div>
    </Layout>
  );
};

interface JobsEntryProps {
  title: string;
  status: "completed" | "in-progress";
  type: "process" | "scenario";
  percentage?: number;
}

const JobsEntry: React.FC<JobsEntryProps> = ({ title, status, type }) => {
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
          <Title className="font-mono">{title}</Title>
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
            <Link href={"/digital-hospital/jobs/results?id=" + title}>
              <Button icon={ArrowUpRight} size="xs">
                Results
              </Button>
            </Link>
          )}
          {type === "scenario" && status === "completed" && (
            <Link href={"/digital-hospital/jobs/scenario?id=" + title}>
              <Button icon={ArrowUpRight} size="xs">
                Results (Scenario Analysis)
              </Button>
            </Link>
          )}
          {status === "in-progress" && (
            <div className="flex items-center space-x-4">
              <ProgressBar value={50} className="mt-1 w-80" />
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
