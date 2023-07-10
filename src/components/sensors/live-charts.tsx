import {
  DateRangePicker,
  Flex,
  type DateRangePickerValue,
} from "@tremor/react";
import { LayoutGrid, Rows } from "lucide-react";
import React, { useState } from "react";
import { LineChart } from "~/components/charts";
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
import { capilatizeFirstLetter } from "~/utils";
import { type ParsedMessage } from "~/websockets/useWS";
import { type LineChartData } from "../charts/line";
import LineComparison from "../line-comparison";

interface LiveChartsProps {
  sensorData: ParsedMessage[];
}

const LiveCharts: React.FC<LiveChartsProps> = ({ sensorData }) => {
  const [filters, setFilters] = useState<string[]>(
    getAllAttributes(sensorData.map((message) => message.payload))
  );
  const [layout, setLayout] = useState<"rows" | "grid">("grid");
  const [dates, setDates] = useState<DateRangePickerValue>({
    from: new Date(),
    to: new Date(),
    selectValue: "tdy",
  });

  const allCharts: LineChartData[] = [];

  filters.forEach((filter) => {
    allCharts.push({
      title: capilatizeFirstLetter(filter),
      data: {
        x: sensorData.map((message) => parseFloat(message.acp_ts) * 1000),
        y: sensorData.map((message) => message.payload[filter]),
      },
      xlabel: "Time",
      ylabel: capilatizeFirstLetter(filter),
      labels: [filter],
    });
  });

  return (
    <div>
      <Flex>
        <div>
          <FacetedFilterButton
            filters={getAllAttributes(
              sensorData.map((message) => message.payload)
            )}
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
        {allCharts.map((chart) => (
          <LineChart key={chart.title as string} {...chart} dateTime />
        ))}
      </div>

      {allCharts.length > 1 && (
        <LineComparison className="mt-8" allData={allCharts} />
      )}
    </div>
  );
};

const getAllAttributes = (obj: { [key: string]: number }[]) =>
  obj.reduce((acc, curr) => {
    Object.keys(curr).forEach((key) => {
      if (!acc.includes(key)) {
        acc.push(key);
      }
    });
    return acc;
  }, [] as string[]);

export default LiveCharts;
