import { Card, Divider, Title } from "@tremor/react";
import { BarChart, LineChart } from "charts";
import { FC } from "react";
import { ScenarioAnalysisResults, SimulationResults } from "~/api/config";
import GridLayout from "~/components/layout/grid-layout";
import LabTAT from "~/components/digital-hospital/lab-tat";
import MetricsList from "~/components/digital-hospital/metrics-list";
import RCPathComparison from "~/components/digital-hospital/rc-path-comparison";
import { Download } from "lucide-react";
import { Button } from "ui";

interface MultiScenarioResultProps {
  results: ScenarioAnalysisResults;
}

const MultiScenarioResult: FC<MultiScenarioResultProps> = ({ results }) => {
  const { mean_tat, mean_utilisation, scenario_ids, utilisation_hourlies } =
    results;

  console.log(results);

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

      <div className="my-4">
        <Card className="px-4">
          <Title className="mt-8">Resource Allocation</Title>

          <GridLayout gridColumns={3}>
            {utilisation_hourlies.map((data, index) => (
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
        </Card>
      </div>
    </div>
  );
};

export default MultiScenarioResult;
