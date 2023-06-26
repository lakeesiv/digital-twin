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
import dynamic from "next/dynamic";

const PlotlyChartNoSSR = dynamic(
  () => import("~/components/charts/plotly-line"),
  {
    ssr: false,
  }
);

const generateData = () => {
  type Result = {
    humidity: Data;
    temperature: Data;
    pressure: Data;
  };

  type Data = {
    x: number[];
    y: number[];
  };

  const res: Result = {
    humidity: {
      x: [],
      y: [],
    },
    temperature: {
      x: [],
      y: [],
    },
    pressure: {
      x: [],
      y: [],
    },
  };

  for (let i = 0; i < 100; i++) {
    const x = Date.now() - i * 1000 * 60 * 60 * 24;
    res.humidity.x.push(x);
    res.humidity.y.push(Math.random() * 100);

    res.temperature.x.push(x);
    res.temperature.y.push(Math.random() * 100);

    res.pressure.x.push(x);
    res.pressure.y.push(Math.random() * 100);
  }
  return res;
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
        {/* {filters.map((filter, i) => {
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
        })} */}
        <PlotlyChartNoSSR
          data={data.humidity}
          title="Humidity"
          xlabel="Time"
          ylabel="Humidity"
          divId="humidity"
          labels={["Humidity"]}
          dateTime
        />
        <PlotlyChartNoSSR
          data={data.temperature}
          title="Temperature"
          xlabel="Time"
          ylabel="Temperature"
          divId="temperature"
          labels={["Temperature"]}
          dateTime
        />
        <PlotlyChartNoSSR
          data={data.pressure}
          title="Pressure"
          xlabel="Time"
          ylabel="Pressure"
          divId="pressure"
          labels={["Pressure"]}
          dateTime
        />
        <PlotlyChartNoSSR
          data={{
            x: data.pressure.x,
            y: [data.pressure.y, data.humidity.y, data.temperature.y],
          }}
          title="All"
          xlabel="Time"
          ylabel="Params"
          divId="all"
          labels={["Pressure", "Humidity", "Temperature"]}
          dateTime
          fill={false}
        />
      </div>
    </div>
  );
}
