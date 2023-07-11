/**
 *
 * LiveCharts: Renders live charts for sensor data.
 *
 * @param {ParsedMessage[]} sensorData - An array of parsed sensor data messages.
 * @returns {JSX.Element} - A React component that renders live charts for sensor data.
 *
 * @description This file contains the LiveCharts component, which is responsible for rendering live charts for sensor data. The component takes in an array of parsed sensor data messages and renders a chart for each attribute in the data. The component also includes a filter button and a date range picker to allow users to filter and select the data they want to see.
 *
 * @example
 *
 * ```
 * import LiveCharts from '~/components/sensors/live-charts';
 *
 * const sensorData = [{...}, {...}, {...}];
 *
 * function App() {
 *   return (
 *     <LiveCharts sensorData={sensorData} />
 *   );
 * }
 * ```
 *
 *
 * @author
 * Lakee Sivaraya <ls914@cam.ac.uk>
 */

import {
  DateRangePicker,
  Flex,
  type DateRangePickerValue,
} from "@tremor/react";
import { Grid, LayoutGrid, Rows } from "lucide-react";
import React, { useEffect, useState } from "react";
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

  const allCharts: LineChartData[] = [];

  useEffect(() => {
    if (filters.length === 0) {
      setFilters(
        getAllAttributes(sensorData.map((message) => message.payload))
      ); // if no filters are selected, select all
    }
  }, [sensorData]);

  // create a chart for each filter and add it to the array
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
              <SelectValue placeholder={<Grid size={18} />} />
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
        className={"mx-auto grid  gap-4 pt-4 " + `grid-cols-${numberOfColumns}`}
      >
        {allCharts.map((chart) => (
          // For all selected charts, create a line chart
          <LineChart
            key={chart.title as string}
            {...chart}
            dateTime // use date time for x axis (UNIX timestamp)
            chartType="svg" // SVG as WebGL does not allow for more than 8 lines
          />
        ))}
      </div>

      {allCharts.length > 1 && (
        // If there are more than 1 charts, then show the comparison chart component
        <LineComparison className="mt-8" allData={allCharts} />
      )}
    </div>
  );
};

// get all attributes from an object of { string: number}
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
