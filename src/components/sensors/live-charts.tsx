import {
  DateRangePicker,
  Flex,
  type DateRangePickerValue,
} from "@tremor/react";
import { Grid, LayoutGrid, Rows } from "lucide-react";
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

interface LiveChartsProps extends React.HTMLAttributes<HTMLDivElement> {
  sensorData: ParsedMessage[];
}

const LiveCharts: React.FC<LiveChartsProps> = ({ sensorData, ...props }) => {
  const [filters, setFilters] = useState<string[]>(
    getAllAttributes(sensorData.map((message) => message.payload))
  );
  const [dates, setDates] = useState<DateRangePickerValue>({
    from: new Date(),
    to: new Date(),
    selectValue: "tdy",
  });
  const [numberOfColumns, setNumberOfColumns] = useState<1 | 2 | 3>(3);
  const defaultIcon = <Grid size={18} />;

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
    <div {...props}>
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
              setNumberOfColumns(parseInt(value) as 1 | 2 | 3);
            }}
          >
            <SelectTrigger className="h-[37px] w-[70px]">
              <SelectValue placeholder={defaultIcon} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Layout</SelectLabel>
                <SelectItem value="1">
                  <Rows size={18} />
                </SelectItem>
                <SelectItem value="2">
                  <LayoutGrid size={18} />
                </SelectItem>
                <SelectItem value="3">
                  <Grid size={18} />
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Flex>
      <div
        className={
          "mx-auto grid  gap-4 pt-4 " + `grid-cols-${numberOfColumns || 3}`
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
