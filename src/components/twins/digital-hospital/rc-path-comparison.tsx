import { Callout, Card, CategoryBar, Grid, Metric, Text } from "@tremor/react";
import { TrendingDown, TrendingUp } from "lucide-react";

const categories = [
  {
    title: "7 Day Progress",
    value: 50,
    target: 80,
  },
  {
    title: "10 Day Progress",
    value: 90,
    target: 90,
  },
  {
    title: "12 Day Progress",
    value: 92,
    target: 95,
  },
  {
    title: "21 Day Progress",
    value: 99,
    target: 95,
  },
];

export default function RCPathComparison() {
  return (
    <Grid numItemsSm={2} numItemsLg={5} className="gap-6">
      <Card>
        <h1 className="text-2xl font-bold">Overall TAT</h1>
        <Metric className="pt-4">90 hrs </Metric>
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
            className="mt-6 font-mono text-sm"
            icon={item.value < item.target ? TrendingDown : TrendingUp}
            color={item.value < item.target ? "red" : "green"}
            title={item.value < item.target ? "Underperforming" : "On Target"}
          >
            RCPath Target {item.target} %
          </Callout>
        </Card>
      ))}
    </Grid>
  );
}
