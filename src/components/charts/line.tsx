import { Card, Flex, Title } from "@tremor/react";
import { useTheme } from "next-themes";
import Plotly from "plotly.js-cartesian-dist-min";
import React, { useEffect, useState } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
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
import DownloadButton from "./download";
import { getColor } from "./utils";

const Plot = createPlotlyComponent(Plotly as object);

export type LineGraphData = {
  title?: string; // optional
  xlabel: string;
  ylabel: string;
  data: {
    x: number[];
    y: number[][] | number[]; // each array is a line [[...], [...], [...]]  or single line [...]
  };
  labels: string[]; // each label is a line ["label1", "label2", "label3"]
};

interface LineProps extends LineGraphData {
  cardProps?: React.ComponentProps<typeof Card>;
  defaultCurveStyle?: "linear" | "step" | "natural";
  divId: string;
  dateTime?: boolean;
  fill?: boolean;
}

/**
 * A line chart component that uses Plotly.js to render a line chart.
 * @param {LineProps} props - The props for the LineChart component.
 * @param {string} props.ylabel - The label for the y-axis.
 * @param {string} props.xlabel - The label for the x-axis.
 * @param {string} [props.title] - The title for the chart (optional).
 * @param {React.ComponentProps<typeof Card>} [props.cardProps] - The props for the Card component (optional).
 * @param {string[]} props.labels - The labels for the data lines.
 * @param {LineGraphData['data']} props.data - The data for the chart.
 * @param {'linear' | 'step' | 'natural'} [props.defaultCurveStyle='linear'] - The default curve style for the chart (optional).
 * @param {string} props.divId - The ID of the div element that the chart will be rendered in.
 * @param {boolean} [props.dateTime] - Whether the x-axis is a date/time axis (optional).
 * @param {boolean} [props.fill=true] - Whether to fill the area under the lines (optional).
 * @returns {JSX.Element} The LineChart component.
 */
const LineChart: React.FC<LineProps> = ({
  ylabel,
  xlabel,
  title,
  cardProps,
  labels,
  data,
  defaultCurveStyle = "linear",
  divId,
  dateTime,
  fill = true,
}) => {
  const [curveStyle, setCurveStyle] = useState<"linear" | "step" | "natural">(
    defaultCurveStyle || "linear"
  );

  const { theme } = useTheme();
  const cardRef = React.useRef<HTMLDivElement>(null);

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

  const x = dateTime ? data.x.map((d) => new Date(d)) : data.x;

  const plottingData: Partial<Plotly.Data>[] = [];

  // check if data.y is an array of arrays or not
  if (Array.isArray(data.y[0])) {
    // multiple lines
    for (let i = 0; i < labels.length; i++) {
      plottingData.push({
        x: x,
        y: data.y[i],
        marker: { color: getColor(i) },
        fill: fill ? "tozeroy" : "none",
        line: { shape: mapCurveStyle(curveStyle) },
        type: "scattergl",
        name: labels[i],
      });
    }
  } else {
    // single line
    plottingData.push({
      x: x,
      y: data.y,
      marker: { color: getColor(0) },
      fill: "tozeroy",
      line: { shape: mapCurveStyle(curveStyle) },
      type: "scattergl",
      name: labels[0],
    });
  }

  return (
    <Card className="mx-auto" {...cardProps} ref={cardRef}>
      <Flex>
        <Title>{title}</Title>
        <div className="flex justify-center">
          <Select
            onValueChange={(value) =>
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
          <DownloadButton
            data={{
              title,
              xlabel,
              ylabel,
              data: data,
              labels: labels,
            }}
            type="line"
            divId={divId}
          />
        </div>
      </Flex>
      <div className="mx-auto mt-8 h-[250px] ring-0">
        <Plot
          divId={divId}
          data={plottingData as object[]}
          layout={getLayout(theme, xlabel, ylabel)}
          useResizeHandler
          className="h-full w-full"
          config={chartConfig as object}
        />
      </div>
    </Card>
  );
};

const mapCurveStyle = (style: "linear" | "step" | "natural") => {
  switch (style) {
    case "linear":
      return "linear";
    case "step":
      return "hv";
    case "natural":
      return "spline";
    default:
      return "linear";
  }
};

const getLayout = (
  theme: string | undefined,
  xlabel: string,
  ylabel: string
) => {
  if (!theme) {
    theme = "light";
  }

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    font: {
      family: "sans-serif",
      color:
        theme === "dark" ? "rgba(150, 150, 150, 0.4)" : "rgb(50, 50, 50, 0.4)",
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
      title: {
        text: xlabel,
      },
    },
    yaxis: {
      gridcolor:
        theme === "dark"
          ? "#rgba(75, 85, 99, 0.4)"
          : "rgba(209, 213, 219, 0.4)",
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

const chartConfig = {
  responsive: true,
  displaylogo: false,
  modeBarButtonsToRemove: [
    "zoom2d",
    "pan2d",
    "select2d",
    "lasso2d",
    "zoomIn2d",
    "zoomOut2d",
    "autoScale2d",
    // "resetScale2d",
    "hoverClosestCartesian",
    "hoverCompareCartesian",
    "zoom3d",
    "pan3d",
    "resetCameraDefault3d",
    "resetCameraLastSave3d",
    "hoverClosest3d",
    "orbitRotation",
    "tableRotation",
    "zoomInGeo",
    "zoomOutGeo",
    "resetGeo",
    "hoverClosestGeo",
    // "toImage",
    "sendDataToCloud",
    "hoverClosestGl2d",
    "hoverClosestPie",
    "toggleHover",
    "resetViews",
    "toggleSpikelines",
    "resetViewMapbox",
  ],
};

export default LineChart;
