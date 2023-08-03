import { Callout, Card, CategoryBar, Grid, Metric, Text } from "@tremor/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { SimulationResults } from "~/api/config";
import { roundToDP } from "~/utils";

const categories = [
  {
    title: "7 Day Progress",
    target: 80,
  },
  {
    title: "10 Day Progress",
    target: 90,
  },
  {
    title: "12 Day Progress",
    target: 95,
  },
  {
    title: "21 Day Progress",
    target: 95,
  },
];

interface RCPathComparisonProps {
  overall_tat: SimulationResults["overall_tat"];
  progress: SimulationResults["progress"];
}

export default function RCPathComparison({
  overall_tat,
  progress,
}: RCPathComparisonProps) {
  const progressValues = Object.values(progress).map((item) => item * 100);

  return (
    <Grid numItemsSm={2} numItemsLg={5} className="gap-6">
      <Card>
        <h1 className="text-2xl font-bold">Overall TAT</h1>
        <Metric className="pt-4">{roundToDP(overall_tat, 2)} hrs </Metric>
      </Card>
      {categories.map((item, idx) => (
        <Card key={item.title}>
          <Text>{item.title}</Text>
          <Metric>{roundToDP(progressValues[idx], 2)} %</Metric>

          <CategoryBar
            values={[progressValues[idx], 100 - progressValues[idx]]}
            colors={[
              progressValues[idx] < item.target ? "orange" : "green",
              "gray",
            ]}
            markerValue={item.target}
            showLabels={false}
            className="mt-3"
          />

          <Callout
            className="mt-6 font-mono text-sm
			dark:bg-gray-800
			"
            icon={progressValues[idx] < item.target ? TrendingDown : TrendingUp}
            color={progressValues[idx] < item.target ? "orange" : "green"}
            title={
              progressValues[idx] < item.target
                ? "Underperforming"
                : "On Target"
            }
          >
            RCPath Target {item.target} %
          </Callout>
        </Card>
      ))}
    </Grid>
  );
}
