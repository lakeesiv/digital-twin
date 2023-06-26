import {
  Card,
  Icon,
  Title,
  Text,
  Button,
  ProgressBar,
  Callout,
} from "@tremor/react";
import { Package, PackageCheck } from "lucide-react";
import React from "react";
import Layout from "~/components/layout";
import StatusBage from "~/components/status-badge";

const JobsPage = () => {
  return (
    <Layout title="Jobs">
      <Callout
        className="my-4"
        title="Please wait around 20 mins for the job to complete"
      />
      <div className="space-y-4">
        <JobsEntry title="Job 3" status="in-progress" type="process" />
        <JobsEntry title="Job 2" status="completed" type="process" />
        <JobsEntry title="Job 1" status="completed" type="scenario" />
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
          icon={status === "completed" ? PackageCheck : Package}
          variant="solid"
          color={status === "completed" ? "emerald" : "gray"}
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
              color="green"
            />
          )}
        </div>
        <div className="flex items-center space-x-6 pl-8">
          {type === "process" && status === "completed" && (
            <>
              <Button size="xs">Bottlenecks</Button>
              <Button size="xs">Resource Utilization</Button>
            </>
          )}
          {type === "scenario" && status === "completed" && (
            <Button size="xs">Scenario Analysis</Button>
          )}
          {status === "in-progress" && (
            <div className="flex items-center space-x-4">
              <ProgressBar value={50} className="mt-1 w-80" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default JobsPage;
