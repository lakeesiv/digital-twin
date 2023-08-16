import { Card, Divider, Title } from "@tremor/react";
import { BarChart, LineChart } from "charts";
import { FC } from "react";
import { SimulationResults } from "~/api/config";
import GridLayout from "~/components/layout/grid-layout";
import LabTAT from "~/components/digital-hospital/lab-tat";
import MetricsList from "~/components/digital-hospital/metrics-list";
import RCPathComparison from "~/components/digital-hospital/rc-path-comparison";
import { Download } from "lucide-react";
import { Button } from "ui";

interface SingleScenarioResultProps {
  results: SimulationResults;
}

const SingleScenarioResult: FC<SingleScenarioResultProps> = ({ results }) => {
  const {
    overall_tat,
    progress,
    lab_tat,
    lab_progress,
    tat_by_stage,
    resource_allocation,
    utilization_by_resource,
    wip_by_stage,
    daily_utilization_by_resource,
  } = results;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <h1 className="text-3xl font-bold">Results</h1>
        <Button
          variant="outline"
          className="mt-1 h-[30px]"
          onClick={() => {
            // save results as json
            const dataStr =
              "data:text/json;charset=utf-8," +
              encodeURIComponent(JSON.stringify(results));
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "results.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
          }}
        >
          <Download size={16} className="mr-3 px-0" /> JSON
        </Button>
      </div>
      <RCPathComparison overall_tat={overall_tat} progress={progress} />
      <LabTAT lab_tat={lab_tat} lab_progress={lab_progress} className="mt-4" />

      <div className="my-4">
        <Card className="px-4">
          <h1 className="text-2xl font-bold">Output Analysis</h1>
          <Divider className="mb-4 mt-2" />

          <Title>Turn Around Times (TAT) by Stage</Title>
          <GridLayout>
            <Card>
              <Title className="text-2xl">TAT by Stage</Title>
              <Divider className="mb-0 mt-2" />
              <MetricsList data={tat_by_stage.data} unit="hrs" capitliaze />
            </Card>
            <BarChart
              {...tat_by_stage}
              extraBottomPadding={20}
              divId={"tat-by-stage"}
            ></BarChart>
          </GridLayout>
          <Title className="mt-8">Resource Allocation</Title>

          <GridLayout gridColumns={3}>
            {resource_allocation.map((data, index) => (
              <LineChart
                key={index}
                defaultCurveStyle="step"
                allowSelectMarker
                marker="line"
                {...data}
                height={200}
                timeUnit={{
                  current: "hour",
                  target: "day",
                  options: ["hour", "day", "week"],
                }}
              />
            ))}
          </GridLayout>
          <Title className="mt-8">WIP By Stage</Title>

          <GridLayout gridColumns={3}>
            {wip_by_stage.map((data, index) => (
              <LineChart
                key={index}
                defaultCurveStyle="step"
                {...data}
                allowSelectMarker
                marker="line"
                height={200}
                timeUnit={{
                  current: "hour",
                  target: "day",
                  options: ["hour", "day", "week"],
                }}
              />
            ))}
          </GridLayout>
        </Card>

        <Card className="mt-4">
          <h1 className="text-2xl font-bold">Resource Utilization</h1>

          <GridLayout>
            <Card>
              <Title className="text-2xl">Percent Utilizations</Title>
              <Divider className="mb-0 mt-2" />
              <MetricsList
                data={utilization_by_resource.data}
                unit="%"
                multiply={100}
              />
            </Card>
            <BarChart
              {...utilization_by_resource}
              extraBottomPadding={20}
              divId={"percent-utilization"}
            />
          </GridLayout>

          <div className="mt-4">
            <LineChart
              defaultCurveStyle="linear"
              fill={false}
              {...daily_utilization_by_resource}
              divId="daily-utilization"
              info={`Number of Busy Resources per Day.\n Use the legend to toggle graphs.\n Double click on the legend to isolate a graph.\n Double click again to bring back all graphs.\n Single click on the legend to hide a graph.`}
              height={600}
              timeUnit={{
                current: "hour",
                target: "day",
                options: ["day", "week"],
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SingleScenarioResult;
