import {
  DateRangePicker,
  Flex,
  type DateRangePickerValue,
} from "@tremor/react";
import { LayoutGrid, Rows } from "lucide-react";
import { useState } from "react";
import FacetedFilterButton from "~/ui/facted-filter-button";
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

  const [filters, setFilters] = useState<string[]>([
    "humidity",
    "temperature",
    "pressure",
  ]);

  // useEffect(() => {
  //   console.log(dates);
  // }, [dates]);

  return (
    <div>
      <Flex>
        <div>
          <FacetedFilterButton
            filters={["humidity", "temperature", "pressure"]}
            selectedFilters={filters}
            setSelectedFilters={setFilters}
            title="Filter"
          />
        </div>
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
        {filters.map((filter, i) => {
          return (
            <TimeSeriesLine
              key={filter}
              data={data}
              categories={[filter]}
              index="timestamp"
              colors={[getColor(i)]}
              title={capaitalize(filter)}
            />
          );
        })}
      </div>
    </div>
  );
}

type TremorColors =
  | "red"
  | "green"
  | "orange"
  | "pink"
  | "lime"
  | "cyan"
  | "purple"
  | "violet"
  | "amber"
  | "emerald"
  | "teal"
  | "indigo"
  | "sky"
  | "blue"
  | "yellow"
  | "fuchsia"
  | "rose"
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone";

const ALL_COLORS: TremorColors[] = [
  "red",
  "green",
  "orange",
  "pink",
  "lime",
  "cyan",
  "purple",
  "violet",
  "amber",
  "emerald",
  "teal",
  "indigo",
  "sky",
  "blue",
  "yellow",
  "fuchsia",
  "rose",
];

const getColor = (index: number) => {
  return ALL_COLORS[index % ALL_COLORS.length] as TremorColors;
};

const capaitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
