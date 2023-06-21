import React, { useState } from "react";
import {
  AreaChart,
  Card,
  type AreaChartProps,
  Title,
  Flex,
} from "@tremor/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "~/ui/select";

interface TimeSeriesDatapoint extends Object {
  timestamp: number | string;
  value?: number;
}

interface TimeSeriesLineProps extends AreaChartProps {
  data: TimeSeriesDatapoint[];
  title: string;
  cardProps?: React.ComponentProps<typeof Card>;
}

const TimeSeriesLine: React.FC<TimeSeriesLineProps> = ({
  data,
  title,
  cardProps,
  ...props
}) => {
  const [curveStyle, setCurveStyle] = useState<"linear" | "step" | "natural">(
    "linear"
  );
  // set props defaults
  props = {
    ...props,
    index: "timestamp",
  };

  // convert timestamps to dates
  if (data.length === 0 && data) {
    if (!data[0]) return null;
    return null;
  }
  const firstDatapoint = data[0] as TimeSeriesDatapoint;
  const lastDatapoint = data[data.length - 1] as TimeSeriesDatapoint;

  // number of days between first and last datapoint
  const days =
    ((lastDatapoint.timestamp as number) -
      (firstDatapoint.timestamp as number)) /
    (1000 * 60 * 60 * 24);

  if (typeof firstDatapoint.timestamp === "number") {
    // convert all timestamps to dates
    data.forEach((datapoint) => {
      console.log(datapoint);
      datapoint.timestamp = formatDateTime(datapoint.timestamp as number);
    });
  }

  return (
    <Card className="mx-auto" {...cardProps}>
      <Flex>
        <Title>{title}</Title>
        <Select
          onValueChange={(value) =>
            setCurveStyle(value as "linear" | "step" | "natural")
          }
        >
          <SelectTrigger
            className="h-[30px]
		  w-[100px]
		  "
          >
            <SelectValue placeholder="Line" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Line Style</SelectLabel>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="step">Step</SelectItem>
              <SelectItem value="natural">Natural</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Flex>
      <AreaChart
        className="mt-8 h-44"
        data={data}
        colors={["indigo"]}
        showYAxis={true}
        showLegend={true}
        startEndOnly={true}
        curveType={curveStyle}
        {...props}
      />
    </Card>
  );
};

const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
  // format dd/mm \n hh:mm:ss
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${day}/${month} \n\n ${hours}:${minutes}:${seconds}`;
};

export default TimeSeriesLine;
