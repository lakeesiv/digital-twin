/**
 * line-comparison-chart.tsx: A component that defines a line comparison chart.
 * !! IMPORTANT !!
 * DO NOT IMPORT THIS FILE DIRECTLY. Instead, import the component from '~/components/charts'.
 *
 * @description This file exports a React functional component that renders a line comparison chart using the Plotly.js library. The component takes in two sets of data in the form of objects with x and y values, and renders a line comparison chart with the specified data. The component also includes a download button and allows for customization of the curve style and time unit.
 *
 * @see {@link https://plotly.com/javascript/line-charts/}
 *
 * @example
 *
 * ```
 * import { LineComparison } from '~/components/charts';
 *
 * function MyComponent() {
 *     const lineData1 = {
 *       data: {
 *         x: [1, 2, 3, 4, 5],
 *         y: [10, 20, 30, 40, 50]
 *       },
 *       labels: ["Label 1"],
 *       ylabel: "Y Label",
 *       xlabel: "X Label",
 *       title: "My Line Chart"
 *     };
 *
 *     const lineData2 = {
 *       data: {
 *         x: [1, 2, 3, 4, 5],
 *         y: [20, 30, 40, 50, 60]
 *       },
 *       labels: ["Label 2"],
 *       ylabel: "Y Label",
 *       xlabel: "X Label",
 *       title: "My Line Chart"
 *     };
 *
 *   return (
 *     <LineComparison
 *       title="My Line Comparison Chart"
 *       lineData1={lineData1}
 *       lineData2={lineData2}
 *     />
 *   );
 * }
 * ```
 *
 * @interface LineComparsionData
 * @property {LineChartData} lineData1 - The data for the first line.
 * @property {LineChartData} lineData2 - The data for the second line.
 * @property {string | JSX.Element} title - The title of the chart.
 * @property {TimeUnit} [timeUnit] - An optional object specifying the current and target time units for the chart, as well as the available options for time unit selection.
 *
 * @interface LineComparisonProps
 * @extends LineComparsionData
 * @property {React.ComponentProps<typeof Card>} [cardProps] - Additional props to pass to the Card component.
 * @property {string} [divId] - The ID of the div containing the chart.
 * @property {boolean} [dateTime] - Whether to display the x-axis as a date/time axis.
 * @property {boolean} [fill] - Whether to fill the area under the lines.
 * @property {number} [height] - The height of the chart in pixels.
 * @property {"linear" | "step" | "natural"} [defaultCurveStyle="linear"] - The default curve style for the lines.
 * @property {boolean} [allowSelectLineStyle=true] - Whether to allow the user to select the line style for the lines.
 * @property {boolean} [shareYAxis=true] - Whether to share the y-axis between the two lines.
 *
 * @interface TimeUnit
 * @property {"hour" | "day" | "week"} current - The current time unit of the data.
 * @property {"hour" | "day" | "week"} target - The target time unit to display.
 * @property {("hour" | "day" | "week")[]} options - The available options for time unit selection.
 *
 * @see {@link https://plotly.com/javascript/line-charts/}
 *
 * @author
 * Lakee Sivaraya <ls914@cam.ac.uk>
 */

import { Card, Flex, Title, type CardProps } from "@tremor/react";
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
} from "ui";
import { capilatizeFirstLetter, useResizeObserver } from "./utils";
import type { LineChartData } from "./line";
import { CHART_CONFIG, getColor, titleToId, mapCurveStyle } from "./utils";

interface TimeUnit {
  current: "hour" | "day" | "week";
  target: "hour" | "day" | "week";
  options: ("hour" | "day" | "week")[];
}

export type LineComparsionData = {
  lineData1: LineChartData;
  lineData2: LineChartData;
  title: string;
  timeUnit?: TimeUnit;
};

export interface LineComparisonProps extends LineComparsionData {
  cardProps?: CardProps;
  defaultCurveStyle?: "linear" | "step" | "smooth";
  divId?: string;
  dateTime?: boolean;
  fill?: boolean;
  height?: number;
  allowSelectLineStyle?: boolean;
  shareYAxis?: boolean;
}

const LineComparison: React.FC<LineComparisonProps> = ({
  title,
  cardProps,
  defaultCurveStyle = "linear",
  divId = titleToId(title),
  dateTime,
  fill = false,
  height = 250,
  timeUnit: timeUnitProp, // rename timeUnit to timeUnitProp
  allowSelectLineStyle = true,
  lineData1,
  lineData2,
  shareYAxis: shareYAxisProp = false, // rename shareYAxis to shareYAxisProp
}) => {
  const [curveStyle, setCurveStyle] = useState<"linear" | "step" | "smooth">(
    defaultCurveStyle || "linear"
  );
  const [shareYAxis, setShareYAxis] = useState<boolean>(shareYAxisProp);

  const [timeUnit, setTimeUnit] = useState<"hour" | "day" | "week" | undefined>(
    timeUnitProp?.current || undefined
  );

  const { theme } = useTheme();
  const cardRef = React.useRef<HTMLDivElement>(null);

  useResizeObserver(cardRef, divId);

  // define the data to be plotted on the chart
  const plottingData: Partial<Plotly.Data>[] = [];

  // convert the x-axis to different time units if needed
  useEffect(() => {
    if (timeUnit) {
      plottingData.forEach((data: { x: number[] }) => {
        data.x = data.x.map((x) => {
          if (timeUnit === "hour") {
            return x;
          } else if (timeUnit === "day") {
            return timeUnitProp?.current === "hour" ? x / 24 : x;
          } else if (timeUnit === "week") {
            return timeUnitProp?.current === "hour"
              ? x / (24 * 7)
              : timeUnitProp?.current === "day"
              ? x / 7
              : x;
          } else {
            return x;
          }
        });
      });
    }
  }, [timeUnit, plottingData, timeUnitProp]);

  // x values for both lines
  let x1 = lineData1.data.x as number[] | number[][] | Date[] | Date[][];
  let x2 = lineData2.data.x as number[] | number[][] | Date[] | Date[][];
  let individualX = false;

  // convert x values to dates if needed
  if (dateTime) {
    // x = (x as number[]).map((x) => new Date(x));
    if (x1[0] instanceof Array) {
      x1 = (x1 as number[][]).map((x) => x.map((x) => new Date(x)));
    } else {
      x1 = (x1 as number[]).map((x) => new Date(x));
    }

    if (x2[0] instanceof Array) {
      x2 = (x2 as number[][]).map((x) => x.map((x) => new Date(x)));
    } else {
      x2 = (x2 as number[]).map((x) => new Date(x));
    }
  }

  // check if data.x is an array of arrays or not (multiple lines)
  if (x1[0] instanceof Array) {
    individualX = true;
  }

  /*
   * -------------------- Handle First Line --------------------
   */

  // check if data.y is an array of arrays or not
  if (Array.isArray(lineData1.data.y[0])) {
    // multiple lines
    for (let i = 0; i < lineData1.labels.length; i++) {
      plottingData.push({
        x: individualX ? x1[i] : x1,
        y: lineData1.data.y[i],
        marker: { color: getColor(i) },
        fill: fill ? "tozeroy" : "none",
        line: { shape: mapCurveStyle(curveStyle) },
        type: "scattergl",
        name: lineData1.labels[i],
      });
    }
  } else {
    // single line
    plottingData.push({
      x: individualX ? x1[0] : x1,
      y: lineData1.data.y,
      marker: { color: getColor(0) },
      fill: fill ? "tozeroy" : "none",
      line: { shape: mapCurveStyle(curveStyle) },
      type: "scattergl",
      name: lineData1.labels[0],
    });
  }

  /*
   * -------------------- Handle Second Line --------------------
   */

  if (Array.isArray(lineData2.data.y[0])) {
    // multiple lines
    for (let i = 0; i < lineData2.labels.length; i++) {
      plottingData.push({
        x: individualX ? x2[i] : x2,
        y: lineData2.data.y[i],
        marker: { color: getColor(i + 1) },
        fill: fill ? "tozeroy" : "none",
        line: { shape: mapCurveStyle(curveStyle) },
        type: "scattergl",
        name: lineData2.labels[i],
        yaxis: shareYAxis ? undefined : "y2",
      });
    }
  } else {
    // single line
    plottingData.push({
      x: individualX ? x2[0] : x2,
      y: lineData2.data.y,
      marker: { color: getColor(1) },
      fill: fill ? "tozeroy" : "none",
      line: { shape: mapCurveStyle(curveStyle) },
      type: "scattergl",
      name: lineData2.labels[0],
      yaxis: shareYAxis ? undefined : "y2",
    });
  }

  return (
    <Card className="mx-auto" {...cardProps} ref={cardRef}>
      <Flex>
        <Title>{title}</Title>

        <div className="flex justify-center">
          {timeUnitProp && (
            <Select
              onValueChange={(value) =>
                setTimeUnit(value as "hour" | "day" | "week")
              }
            >
              <SelectTrigger className="mr-4 h-[30px] w-[100px]">
                <SelectValue
                  placeholder={capilatizeFirstLetter(
                    timeUnitProp?.current || "hour"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Time Unit</SelectLabel>
                  {timeUnitProp?.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {capilatizeFirstLetter(option)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          <Select
            onValueChange={(value) =>
              setShareYAxis(value === "true" ? true : false)
            }
          >
            <SelectTrigger className="mr-4 h-[30px] w-[100px]">
              <SelectValue
                placeholder={shareYAxisProp ? "Share" : "Seperate"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Y Axis</SelectLabel>
                <SelectItem value="true">Share</SelectItem>
                <SelectItem value="false">Seperate</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {allowSelectLineStyle && (
            <Select
              onValueChange={(value) =>
                setCurveStyle(value as "linear" | "step" | "smooth")
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
                  <SelectItem value="smooth">Smooth</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </Flex>
      <div
        className={"mx-auto mt-8 ring-0 " + `h-[${height}px]`}
        style={{ height: `${height}px` }}
      >
        <Plot
          divId={divId}
          data={plottingData as object[]}
          layout={getLayout(
            theme,
            lineData1.ylabel,
            lineData2.ylabel,
            shareYAxis
          )}
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
  ylabel1: string,
  ylabel2: string,
  shareYAxis: boolean
) => {
  if (!theme) {
    theme = "light";
  }

  const fontColor =
    theme === "dark" ? "rgba(150, 150, 150, 0.4)" : "rgba(0, 0, 0, 0.9)";
  const gridColor =
    theme === "dark" ? "rgba(75, 85, 99, 0.4)" : "rgba(209, 213, 219, 0.4)";

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    font: {
      family: "sans-serif",
      color: fontColor,
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
      l: 60,
      r: 10,
      b: 40,
      t: 10,
      pad: 0,
    },
    xaxis: {
      showgrid: false,
      linecolor: "rgba(0, 0, 0, 0)",
      zerolinecolor: fontColor,
      // title: {
      //   text: xlabel || "", // !! NOTE: Adding a stateful xlabel causes the chart axis to mess up on initial load
      // },
    },
    yaxis: {
      gridcolor: gridColor,
      zerolinecolor: gridColor,
      showgrid: true,
      linecolor: "rgba(0, 0, 0, 0)",
      griddash: "dot",
      title: {
        text: shareYAxis ? ylabel1 + " | " + ylabel2 : ylabel1,
      },
      hoverformat: ".2f",
      titlefont: !shareYAxis ? { color: getColor(0) } : fontColor,
      tickfont: !shareYAxis ? { color: getColor(0) } : fontColor,
    },
    yaxis2: {
      gridcolor: gridColor,
      zerolinecolor: gridColor,

      titlefont: !shareYAxis ? { color: getColor(1) } : fontColor,
      tickfont: !shareYAxis ? { color: getColor(1) } : fontColor,
      showgrid: true,
      linecolor: "rgba(0, 0, 0, 0)",
      griddash: "dot",
      overlaying: "y",
      side: "right",
      title: {
        text: ylabel2,
      },
      hoverformat: ".2f",
    },
  };

  return layout as object;
};

export default LineComparison;
