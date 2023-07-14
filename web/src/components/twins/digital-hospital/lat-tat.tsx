import { Callout, Card, CategoryBar, Grid, Metric, Text } from "@tremor/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "ui";

const categories = [
  {
    title: "3 Day Progress",
    value: 50,
    target: 80,
  }
];

interface LatTATProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function LatTAT(
	{...props} : LatTATProps
) {

	const gridClassName = cn("gap-6", props.className);

  return (
    <Grid numItemsSm={2} numItemsLg={2} className={gridClassName}>
      <Card>
        <h1 className="text-2xl font-bold">Lab TAT</h1>
        <Metric className="pt-4">20 hrs </Metric>
      </Card>
      {categories.map((item) => (
        <Card key={item.title}>
          <Text>{item.title}</Text>
          <Metric>{item.value} %</Metric>

          <CategoryBar
            values={[item.value, 100 - item.value]}
            colors={[item.value < item.target ? "orange" : "green", "gray"]}
            markerValue={item.target}
            showLabels={false}
            className="mt-3"
          />

          <Callout
            className="mt-6 font-mono text-sm
			dark:bg-gray-800
			"
            icon={item.value < item.target ? TrendingDown : TrendingUp}
            color={item.value < item.target ? "orange" : "green"}
            title={item.value < item.target ? "Underperforming" : "On Target"}
          >
        Target {item.target} %
          </Callout>
        </Card>
      ))}
    </Grid>
  );
}
