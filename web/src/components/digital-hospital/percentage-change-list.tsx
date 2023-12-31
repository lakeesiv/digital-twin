import { ScrollArea } from "ui";
import { ListItem, BadgeDelta, Text, List } from "@tremor/react";
import type { BarChartData } from "charts";
import { roundToDP } from "~/utils";
import { stages } from ".";

interface PercentChangeListProps {
  data: BarChartData["data"];
}

const PercentChangeList: React.FC<PercentChangeListProps> = ({ data }) => {
  const stages = data.x;
  if (!data.y) return null;
  if (!data.y[0]) return null;
  if (!data.y[1]) return null;
  if (!data.y[0][0]) return null;

  const percentIncrease = data.y[1].map((actual, index) => {
    const targets = data.y[0];
    const currentTarget = targets[index];
    return roundToDP(((actual - currentTarget) / currentTarget) * 100, 2);
  });

  // order by percetage decrease
  const sortedIndexes = percentIncrease
    .map((_, index) => index)
    .sort((a, b) => percentIncrease[b] - percentIncrease[a]);

  return (
    <ScrollArea className="h-[300px]">
      <List>
        {sortedIndexes.map((index) => (
          <PercentChangeListItem
            key={stages[index]}
            target={data.y[0][index]}
            actual={data.y[1][index]}
            stage={stages[index]}
          />
        ))}
      </List>
    </ScrollArea>
  );
};

interface PercentChangeListItemProps {
  target: number;
  actual: number;
  stage: string | number;
}
const PercentChangeListItem: React.FC<PercentChangeListItemProps> = ({
  target,
  actual,
  stage,
}) => {
  return (
    <ListItem>
      <div>
        <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          {stage}
        </Text>
        <Text>
          Target: {target} | Actual: {actual}
        </Text>
      </div>
      <BadgeDelta
        deltaType={
          actual > target
            ? "increase"
            : actual < target
            ? "decrease"
            : "unchanged"
        }
        className={
          actual > target
            ? "bg-red-500 text-red-100"
            : actual < target
            ? "bg-green-500 text-green-100"
            : "bg-gray-100 text-gray-800"
        }
      >
        {roundToDP(((actual - target) / target) * 100, 1)} %
      </BadgeDelta>
    </ListItem>
  );
};

export const mockBottleNeckData: BarChartData = {
  data: {
    x: stages,
    y: [
      [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 10, 12],
      [20, 18, 16, 14, 12, 10, 30, 12, 40, 20, 30, 10, 12],
    ],
    labels: ["Target", "Actual"],
  },
  xlabel: "Stages",
  ylabel: "TAT",
  title: "TAT by Stage",
};

export default PercentChangeList;
