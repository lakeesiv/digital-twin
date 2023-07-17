/**
 * line.tsx: A component that defines a line chart.
 * !! IMPORTANT !!
 * DO NOT IMPORT THIS FILE DIRECTLY. Instead, import the component from '~/components/charts'.
 *
 * @description This file exports a React functional component that renders a line chart using the Plotly.js library. The component takes in data in the form of an object with x and y values, and renders a line chart with the specified data. The component also includes a download button and allows for customization of the curve style and time unit.
 *
 * @see {@link https://plotly.com/javascript/line-charts/}
 *
 * @example
 *
 * ```
 * import { LineChart } from '~/components/charts';
 *
 * function MyComponent() {
 *   const data = {
 *     x: [1, 2, 3, 4, 5],
 *     y: [10, 20, 30, 40, 50],
 *   };
 *
 *   return (
 *     <LineChart
 *       title="My Line Chart"
 *       xlabel="X Label"
 *       ylabel="Y Label"
 *       data={data}
 *     />
 *   );
 * }
 * ```
 *
 * @interface LineChartData
 * @property {string | JSX.Element} title - The title of the chart.
 * @property {string} xlabel - The label for the x-axis.
 * @property {string} ylabel - The label for the y-axis.
 * @property {Object} data - The data for the chart.
 * @property {number[] | number[][]} data.x - The x values for the chart. Can be either a single array of x values (global), or an array of arrays of x values for each line.
 * @property {number[][] | number[]} data.y - The y values for the chart. Can be either an array of arrays of y values for each line, or a single array of y values.
 * @property {string[]} labels - The labels for each line in the chart.
 * @property {boolean[]} [visible] - An optional array of booleans indicating whether each line is visible or not.
 * @property {TimeUnit} [timeUnit] - An optional object specifying the current and target time units for the chart, as well as the available options for time unit selection.
 *
 * @interface LineProps
 * @extends LineChartData
 * @property {React.ComponentProps<typeof Card>} [cardProps] - Additional props to pass to the Card component.
 * @property {string} [divId] - The ID of the div containing the chart.
 * @property {boolean} [dateTime] - Whether to display the x-axis as a date/time axis.
 * @property {boolean} [fill] - Whether to fill the area under the lines.
 * @property {number} [height] - The height of the chart in pixels.
 * @property {"linear" | "step" | "natural"} [defaultCurveStyle="linear"] - The default curve style for the lines.
 * @property {boolean} [allowSelectCurveStyle=false] - Whether to allow the user to select the curve style for the lines.
 * @property {"webgl" | "svg"} [chartType="webgl"] - The type of chart to render.
 *
 * @interface TimeUnit
 * @property {"hour" | "day" | "week"} current - The current time unit of the data.
 * @property {"hour" | "day" | "week"} target - The target time unit to display.
 * @property {("hour" | "day" | "week")[]} options - The available options for time unit selection.
 *
 *
 * @author
 * Lakee Sivaraya <ls914@cam.ac.uk>
 */

import { Card, Flex, Title, type CardProps } from "@tremor/react";
import { Info } from "lucide-react";
import { useTheme } from "next-themes";
import Plotly from "plotly.js";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "ui";
import DownloadButton from "./download";
import {
  CHART_CONFIG,
  capilatizeFirstLetter,
  getColor,
  mapCurveStyle,
  titleToId,
} from "./utils";

export interface TimeUnit {
  current: "hour" | "day" | "week"; // current time unit of the data
  target: "hour" | "day" | "week"; // target time unit to display
  options: ("hour" | "day" | "week")[]; // options for time unit selection
}

export type LineChartData = {
  title: string; // title can be a string or a JSX element
  xlabel: string;
  ylabel: string;
  data: {
    x: number[] | number[][]; // either one array of x values (global), or an array of arrays of x values for each line
    y: number[][] | number[]; // each array is a line [[...], [...], [...]]  or single line [...]
  };
  labels: string[]; // each label is a line ["label1", "label2", "label3"]
  visible?: boolean[]; // each boolean is a line [true, false, true]
  timeUnit?: TimeUnit;
  info?: string; // additional info to display in the card
};

export interface LineProps extends LineChartData {
  cardProps?: CardProps;
  divId?: string;
  dateTime?: boolean;
  fill?: boolean;
  height?: number;
  defaultCurveStyle?: "linear" | "step" | "natural";
  allowSelectCurveStyle?: boolean;
  chartType?: "webgl" | "svg";
  rangeSlider?: boolean;
}

export const LineChart: React.FC<LineProps> = ({
  ylabel,
  xlabel,
  title,
  cardProps,
  labels,
  data,
  defaultCurveStyle = "linear",
  divId = titleToId(title),
  dateTime,
  fill = false,
  height = 250,
  visible,
  timeUnit: t,
  allowSelectCurveStyle: allowSelectLineStyle = false,
  chartType = "svg",
  info,
  rangeSlider = false,
}) => {
  const [curveStyle, setCurveStyle] = useState<"linear" | "step" | "natural">(
    defaultCurveStyle || "linear"
  );

  const [timeUnit, setTimeUnit] = useState<"hour" | "day" | "week" | undefined>(
    t?.target
  );
  const [xlabelState, setXlabelState] = useState<string>(xlabel);

  const { theme } = useTheme();
  const cardRef = React.useRef<HTMLDivElement>(null);
  // const plottingData = useMemo<Partial<Plotly.Data>[]>(() => [], []);

  // observe the card div for resize and resize the plotly chart
  useEffect(() => {
    if (!cardRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      const Lib = Plotly as { Plots: { resize: (el: string) => void } };
      Lib.Plots.resize(divId);
    });
    resizeObserver.observe(cardRef.current);
    return () => resizeObserver.disconnect(); // clean up
  }, [divId]);

  const plottingData: Partial<Plotly.Data>[] = [];

  useEffect(() => {
    if (timeUnit) {
      plottingData.forEach((data: { x: number[] }) => {
        data.x = data.x.map((x) => {
          if (timeUnit === "hour") {
            return x;
          } else if (timeUnit === "day") {
            return t?.current === "hour" ? x / 24 : x;
          } else if (timeUnit === "week") {
            return t?.current === "hour"
              ? x / (24 * 7)
              : t?.current === "day"
              ? x / 7
              : x;
          } else {
            return x;
          }
        });
      });

      const newXLabel = "Time (" + capilatizeFirstLetter(timeUnit) + ")";
      setXlabelState(newXLabel);
    }
  }, [timeUnit, plottingData]);

  let x = data.x as number[] | number[][] | Date[] | Date[][];
  let individualX = false;

  if (dateTime) {
    // x = (x as number[]).map((x) => new Date(x));
    if (x[0] instanceof Array) {
      x = (x as number[][]).map((x) => x.map((x) => new Date(x)));
    } else {
      x = (x as number[]).map((x) => new Date(x));
    }
  }

  if (x[0] instanceof Array) {
    individualX = true;
  }

  // check if data.y is an array of arrays or not
  if (Array.isArray(data.y[0])) {
    // multiple lines
    for (let i = 0; i < labels.length; i++) {
      plottingData.push({
        x: individualX ? x[i] : x,
        y: data.y[i],
        marker: { color: getColor(i) },
        fill: fill ? "tozeroy" : "none",
        line: { shape: mapCurveStyle(curveStyle) },
        type: chartType === "webgl" ? "scattergl" : "scatter",
        name: labels[i],
        visible: visible ? (visible[i] ? true : "legendonly") : true,
      });
    }
  } else {
    // single line
    plottingData.push({
      x: individualX ? x[0] : x,
      y: data.y,
      marker: { color: getColor(0) },
      fill: fill ? "tozeroy" : "none",
      line: { shape: mapCurveStyle(curveStyle) },
      type: chartType === "webgl" ? "scattergl" : "scatter",
      name: labels[0],
    });
  }

  return (
    <Card className="mx-auto" {...cardProps} ref={cardRef}>
      <Flex>
        {!info ? (
          <Title>{title}</Title>
        ) : (
          <div className="flex flex-row justify-center">
            {title}
            <div className="ml-4 mt-[1.5px]">
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger>
                    <Info
                      className="h-6 w-6 text-gray-500 hover:text-gray-700
  dark:text-gray-300 dark:hover:text-gray-400"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span
                      className="whitespace-pre-wrap text-sm text-gray-500
  dark:text-gray-300
  "
                    >
                      {info}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          {timeUnit && (
            <Select
              onValueChange={(value: string) =>
                setTimeUnit(value as "hour" | "day" | "week")
              }
            >
              <SelectTrigger className="h-[30px] w-[100px]">
                <SelectValue
                  placeholder={capilatizeFirstLetter(t?.target || "hour")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Time Unit</SelectLabel>
                  {t?.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {capilatizeFirstLetter(option)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {allowSelectLineStyle && (
            <Select
              onValueChange={(value: string) =>
                setCurveStyle(value as "linear" | "step" | "natural")
              }
            >
              <SelectTrigger className="h-[30px] w-[100px]">
                <SelectValue
                  placeholder={capilatizeFirstLetter(
                    defaultCurveStyle || "Linear"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Line Style</SelectLabel>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="step">Step</SelectItem>
                  <SelectItem value="natural">Smooth</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <DownloadButton
            data={{
              title,
              xlabel: xlabelState,
              ylabel,
              data: data,
              labels: labels,
            }}
            type="line"
            divId={divId}
          />
        </div>
      </Flex>
      <div
        className={"mx-auto mt-8 ring-0 " + `h-[${height}px]`}
        style={{ height: `${height}px` }}
      >
        <Plot
          divId={divId}
          data={plottingData as object[]}
          layout={getLayout(theme, xlabelState, ylabel, dateTime, rangeSlider)}
          useResizeHandler
          className="h-full w-full"
          config={CHART_CONFIG as object}
        />
      </div>
    </Card>
  );
};

const getLayout = (
  theme: string | undefined,
  xlabel: string,
  ylabel: string,
  dateTime?: boolean,
  rangeSlider?: boolean
) => {
  if (!theme) {
    theme = "light";
  }
  const fontColor =
    theme === "dark" ? "rgba(150, 150, 150, 0.4)" : "rgba(0, 0, 0, 0.9)";
  const gridColor =
    theme === "dark" ? "rgba(75, 85, 99, 0.4)" : "rgba(209, 213, 219, 0.4)";
  const buttonBgColor = theme === "dark" ? "rgb(2, 8, 23)" : undefined;

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    font: {
      family: "sans-serif",
      color: theme === fontColor,
    },
    modebar: {
      bgcolor: "rgba(0, 0, 0, 0)",
      orientation: "v",
      color: theme === "dark" ? "#fff" : "#000",
      activecolor: theme === "dark" ? "#fff" : "#000",
    },
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    margin: {
      l: 40,
      r: 20,
      b: 40,
      t: 10,
      pad: 0,
    },
    xaxis: {
      showgrid: false,
      linecolor: "rgba(0, 0, 0, 0)",
      zerolinecolor: gridColor,
      title: {
        text: xlabel,
      },
      rangeselector: dateTime
        ? {
            buttons: [
              {
                step: "hour",
                stepmode: "backward",
                count: 1,
                label: "1hr",
              },
              {
                step: "hour",
                stepmode: "backward",
                count: 24 * 7,
                label: "1w",
              },
              {
                step: "month",
                stepmode: "backward",
                count: 1,
                label: "1m",
              },
              {
                step: "year",
                stepmode: "backward",
                count: 1,
                label: "1y",
              },
              {
                step: "all",
                label: "All",
              },
            ],
            font: {
              color: fontColor,
            },
            bgcolor: buttonBgColor,
            showactive: true,
          }
        : undefined,
      rangeslider: rangeSlider ?? {},
    },
    yaxis: {
      gridcolor: gridColor,
      zerolinecolor: gridColor,
      showgrid: true,
      linecolor: "rgba(0, 0, 0, 0)",
      griddash: "dot",
      title: {
        text: ylabel,
      },
      hoverformat: ".2f",
    },
  };

  return layout as object; // fixing type error
};

export default LineChart;
