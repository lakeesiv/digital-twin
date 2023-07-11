import React from "react";
import FacetedFilterButton from "~/ui/facted-filter-button";
import { Card } from "@tremor/react";
import { Label } from "~/ui/label";
import { Switch } from "~/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";
import { type LineChartData } from "./charts/line";
import { LineComparisonChart } from "./charts";
import Tooltip from "~/ui/tooltip";

interface LineComparisonProps extends React.HTMLAttributes<HTMLDivElement> {
  allData: LineChartData[];
}

const LineComparison: React.FC<LineComparisonProps> = ({
  allData,
  ...props
}) => {
  const [filters, setFilters] = React.useState<string[]>([]);
  const [timeUnit, setTimeUnit] = React.useState<"hour" | "day">("hour");
  const [useTimeSeries, setUseTimeSeries] = React.useState<boolean>(false);
  const [useDateTime, setUseDateTime] = React.useState<boolean>(false);
  const allTitles = allData.map((d) => d.title);

  return (
    <Card {...props}>
      <div className="mb-4 flex items-center space-x-4">
        <FacetedFilterButton
          filters={allTitles}
          selectedFilters={filters}
          setSelectedFilters={setFilters}
          title="Select Two Lines"
          limit={2}
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="time-series"
            checked={useTimeSeries}
            onCheckedChange={(e) => {
              if (useDateTime && e) {
                setUseDateTime(false);
              }
              setUseTimeSeries(e);
            }}
          />
          <Tooltip
            tooltip={`Allows you to change the time unit of the X axis to hour, day, or week\nSpecifiy source time unit in the select box`}
          >
            <Label htmlFor="time-series">Time Series</Label>
          </Tooltip>
          {useTimeSeries && (
            <Select
              onValueChange={(value) => setTimeUnit(value as "hour" | "day")}
            >
              <SelectTrigger className="ml-8 h-[30px] w-[80px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Source Time Unit</SelectLabel>
                  <SelectItem value="hour">Hour</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <Switch
            id="date-time"
            checked={useDateTime}
            onCheckedChange={(e) => {
              if (useTimeSeries && e) {
                setUseTimeSeries(false);
              }
              setUseDateTime(e);
            }}
          />
          <Tooltip tooltip="Converts X axis from Unix timestamp to date time">
            <Label htmlFor="date-time">Date Time</Label>
          </Tooltip>
        </div>
      </div>
      {filters.length === 2 ? (
        <LineComparisonChart
          lineData1={
            allData.find((d) => d.title === filters[0]) as LineChartData
          }
          lineData2={
            allData.find((d) => d.title === filters[1]) as LineChartData
          }
          dateTime={useDateTime}
          timeUnit={
            useTimeSeries
              ? {
                  current: timeUnit,
                  target: timeUnit,
                  options:
                    timeUnit === "hour"
                      ? ["hour", "day", "week"]
                      : timeUnit === "day"
                      ? ["day", "week"]
                      : ["week"],
                }
              : undefined
          }
          title="Comparison"
        />
      ) : (
        <Card className="py-40 text-center text-2xl font-semibold ">
          Select two lines to compare
        </Card>
      )}
    </Card>
  );
};

export default LineComparison;
