import { Callout, Card, CategoryBar, Grid, Metric, Text } from "@tremor/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "ui";
import { SimulationResults } from "~/api/config";
import { roundToDP } from "~/utils";

const categories = [
  {
    title: "3 Day Progress",
    target: 80,
  },
];

interface LabTATProps extends React.HTMLAttributes<HTMLDivElement> {
  lab_tat: SimulationResults["lab_tat"];
  lab_progress: SimulationResults["lab_progress"];
}

const LabTAT: React.FC<LabTATProps> = ({ lab_tat, lab_progress, ...props }) => {
  const gridClassName = cn("gap-6", props.className);
  const progressValues = Object.values(lab_progress).map((item) => item * 100);

  return (
    <Grid numItemsSm={2} numItemsLg={2} className={gridClassName}>
      <Card>
        <h1 className="text-2xl font-bold">Lab TAT</h1>
        <Metric className="pt-4">{roundToDP(lab_tat, 2)} hrs </Metric>
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
            Target {item.target} %
          </Callout>
        </Card>
      ))}
    </Grid>
  );
};

export default LabTAT;
