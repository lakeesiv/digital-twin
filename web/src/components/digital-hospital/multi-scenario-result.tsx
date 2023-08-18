import { Card, Title } from "@tremor/react";
import { BarChart, LineChart } from "charts";
import { Download } from "lucide-react";
import { FC } from "react";
import { Button } from "ui";
import { ScenarioAnalysisResults } from "~/api/config";
import GridLayout from "~/components/layout/grid-layout";

interface MultiScenarioResultProps {
  results: ScenarioAnalysisResults;
}

const MultiScenarioResult: FC<MultiScenarioResultProps> = ({ results }) => {
  const { mean_tat, mean_utilisation, scenario_ids, utilisation_hourlies } =
    results;

  //   console.log(utilisation_hourlies);

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

      <BarChart extraBottomPadding={20} divId="tat-by-stage" {...mean_tat} />

      <div className="my-4">
        <Card className="px-4">
          <Title className="mt-8">Overall Resource Utilization</Title>

          <GridLayout gridColumns={3}>
            {mean_utilisation.map((data, index) => (
              <BarChart {...data} extraBottomPadding={20} />
            ))}
          </GridLayout>
          <Title className="mt-8">Daily Resource Utilization</Title>

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

      <h1 className="mt-12 text-3xl font-bold">Individual Scenario Metrics</h1>
      <p className="mt-2">
        Click on the buttons below to view the results of each scenario.
      </p>
      <div className="mt-4 flex gap-2">
        {scenario_ids.map((id, idx) => (
          <a href={`/digital-hospital/results/single?id=${id}`} target="_blank">
            <Button key={id} variant="outline">
              Scenario {idx + 1}
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MultiScenarioResult;
