import { List, ListItem, Text } from "@tremor/react";
import type { BarChartData } from "~/components/charts/bar";
import { Badge } from "~/ui/badge";
import { ScrollArea } from "~/ui/scroll-area";
import { roundToDP } from "~/utils";

interface MetricsListProps {
  data: BarChartData["data"];
  order?: "asc" | "desc";
  unit?: string;
}

const MetricsList: React.FC<MetricsListProps> = ({
  data,
  order = "desc",
  unit = "",
}) => {
  const stages = data.x;

  const metrics = data.y[0];

  // order by percetage decrease
  const sortedIndexes = metrics
    .map((_, index) => index)
    .sort((a, b) =>
      order === "asc" ? metrics[a] - metrics[b] : metrics[b] - metrics[a]
    );

  return (
    <ScrollArea className="h-[300px]">
      <List>
        {sortedIndexes.map((index) => (
          <MetricsItem
            key={stages[index]}
            percentile={data.y[0][index]}
            stage={stages[index]}
            unit={unit}
          />
        ))}
      </List>
    </ScrollArea>
  );
};

interface MetricsItemProps {
  percentile: number;
  stage: string | number;
  unit: string;
}
const MetricsItem: React.FC<MetricsItemProps> = ({
  percentile,
  stage,
  unit,
}) => {
  return (
    <ListItem>
      <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        {stage}
      </Text>
      <Badge>
        {roundToDP(percentile, 2)} {unit}
      </Badge>
    </ListItem>
  );
};

export default MetricsList;
