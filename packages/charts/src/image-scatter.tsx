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
import { Info, MoveHorizontal } from "lucide-react";
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
  Toggle,
  DefaultTooltip,
  AspectRatio,
} from "ui";
import DownloadButton from "./download";
import {
  CHART_CONFIG,
  capilatizeFirstLetter,
  getColor,
  mapCurveStyle,
  titleToId,
} from "./utils";

export type LineChartData = {
  title: string; // title can be a string or a JSX element
  xlabel: string;
  ylabel: string;
  data: {
    x: number;
    y: number;
    ts: number;
    sensor: string;
    data: Record<string, number>;
  }[];
  labels: string[]; // each label is a line ["label1", "label2", "label3"]
  visible?: boolean[]; // each boolean is a line [true, false, true]
  info?: string; // additional info to display in the card
};

export interface LineProps extends LineChartData {
  cardProps?: CardProps;
  divId?: string;
  dateTime?: boolean;
  fill?: boolean;
  height?: number;
  defaultCurveStyle?: "linear" | "step" | "natural";
  chartType?: "webgl" | "svg";
}

export const ImageScatter: React.FC<LineProps> = ({
  ylabel,
  xlabel,
  title,
  cardProps,
  labels,
  data,
  divId = titleToId(title),
  dateTime,
  fill = false,
  height = 250,
  visible,
  chartType = "svg",
  info,
}) => {
  const { theme } = useTheme();
  const cardRef = React.useRef<HTMLDivElement>(null);

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

  // check if data.y is an array of arrays or not

  // for every label, create a trace
  labels.forEach((label, i) => {
    // return data where label=sensor
    const filteredData = data.filter((d) => d.sensor === label);

    const x = filteredData.map((d) => d.x);
    const y = filteredData.map((d) => d.y);
    const ts = filteredData.map((d) => d.ts);
    const sensorData = filteredData.map((d) => d.data);
    // for each attribute in sensorData (e.g. "temperature", "humidity", etc.)
    // write a hovertemplate
    let hovertemplate = `<b>Sensor: ${label}</b><br>`;
    for (const [key, value] of Object.entries(sensorData[0])) {
      hovertemplate += `<span>${key}: ${value}</span><br>`;
    }

    plottingData.push({
      x,
      y,
      ts,
      name: label,
      type: "scatter",
      mode: "markers",
      marker: {
        color: getColor(i),
        colorscale: "Viridis",
      },
      hovertemplate: hovertemplate,
    });
  });

  console.log(plottingData);

  return (
    <Card {...cardProps} ref={cardRef}>
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
      </Flex>
      <div
        style={{
          width: "600px",
          display: "grid",
          placeItems: "center",
        }}
      >
        <AspectRatio ratio={781 / 749}>
          <Plot
            divId={divId}
            data={plottingData as object[]}
            layout={getLayout(theme, xlabel, ylabel)}
            useResizeHandler
            className="h-full w-full"
            config={CHART_CONFIG as object}
          />
        </AspectRatio>
      </div>
    </Card>
  );
};

const getLayout = (
  theme: string | undefined,
  xlabel: string,
  ylabel: string
) => {
  if (!theme) {
    theme = "light";
  }
  const fontColor =
    theme === "dark" ? "rgba(150, 150, 150, 0.4)" : "rgba(0, 0, 0, 0.9)";
  const gridColor = "black";

  const layout: Partial<Plotly.Layout> = {
    images: [
      {
        source:
          "https://upload.wikimedia.org/wikipedia/commons/6/66/Cambridge_centre_map.png",
        xref: "x",
        yref: "y",
        x: 0,
        sizex: 50,
        y: 50,
        sizey: 50,
        sizing: "stretch",
        opacity: 0.2,
        layer: "below",
      },
    ],
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
      showgrid: true,
      linecolor: "rgba(0, 0, 0, 0)",
      gridcolor: gridColor,
      griddash: "dot",
      zerolinecolor: gridColor,
      range: [0, 50],
      title: {
        text: xlabel,
      },
    },
    yaxis: {
      gridcolor: gridColor,
      zerolinecolor: gridColor,
      showgrid: true,
      linecolor: "rgba(0, 0, 0, 0)",
      griddash: "dot",
      range: [0, 50],

      title: {
        text: ylabel,
      },
      hoverformat: ".2f",
    },
  };

  return layout as object; // fixing type error
};

export default ImageScatter;
