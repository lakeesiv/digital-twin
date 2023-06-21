import { Flex, Title } from "@tremor/react";
import { LayoutGrid, Rows } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";
import TimeSeriesLine from "./charts/timeseries-line";
import { useEffect, useState } from "react";
import { DateRangePicker, type DateRangePickerValue } from "@tremor/react";

const generateData = () => {
  type Datapoint = {
    humidity: number;
    temperature: number;
    pressure: number;
    timestamp: number;
  };

  const datapoints: Datapoint[] = [];

  for (let i = 0; i < 100; i++) {
    datapoints.push({
      humidity: Math.random() * 100,
      temperature: Math.random() * 100,
      pressure: Math.random() * 100,
      timestamp: Date.now() - i * 1000 * 60 * 60 * 24,
    });
  }
  return datapoints;
};

const data = generateData();

export default function Example() {
  const [layout, setLayout] = useState<"rows" | "grid">("grid");
  const [dates, setDates] = useState<DateRangePickerValue>({
    from: new Date(),
    to: new Date(),
    selectValue: "tdy",
  });

  // useEffect(() => {
  //   console.log(dates);
  // }, [dates]);

  return (
    <div>
      <Flex>
        <div></div>
        <div className="flex justify-center space-x-2">
          <DateRangePicker
            className="mx-auto  max-w-md "
            value={dates}
            onValueChange={setDates}
            selectPlaceholder="Select"
          />
          <Select
            onValueChange={(value) => {
              setLayout(value as "rows" | "grid");
            }}
          >
            <SelectTrigger className="h-[37px] w-[80px]">
              <SelectValue placeholder={<LayoutGrid size={18} />} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Layout</SelectLabel>
                <SelectItem value="rows">
                  <Rows size={18} />
                </SelectItem>
                <SelectItem value="grid">
                  <LayoutGrid size={18} />
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Flex>
      <div
        className={
          "mx-auto grid  gap-4 pt-4 " +
          (layout === "grid" ? "grid-cols-2" : "grid-cols-1")
        }
      >
        <TimeSeriesLine
          data={data}
          title="Humidity"
          categories={["humidity"]}
          index="timestamp"
        />
        <TimeSeriesLine
          data={data}
          title="Temperature"
          categories={["temperature"]}
          index="timestamp"
          colors={["red"]}
        />
        <TimeSeriesLine
          title="Pressure"
          data={data}
          categories={["pressure"]}
          index="timestamp"
          colors={["blue"]}
        />
      </div>
    </div>
  );
}
