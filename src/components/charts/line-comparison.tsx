import { Card, Flex, Title } from "@tremor/react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
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
import Plotly from "plotly.js";
import Plot from "react-plotly.js";
import type { LineChartData } from "./line";

interface TimeUnit {
  current: "hour" | "day" | "week";
  target: "hour" | "day" | "week";
  options: ("hour" | "day" | "week")[];
}

export type LineComparsionData = {
  lineData1: LineChartData;
  lineData2: LineChartData;
  title: string;
};

interface LineComparisonProps extends LineComparsionData {
  cardProps?: React.ComponentProps<typeof Card>;
  defaultCurveStyle?: "linear" | "step" | "natural";
  divId: string;
  dateTime?: boolean;
  fill?: boolean;
  height?: number;
  allowSelectLineStyle?: boolean;
}

const LineComparison: React.FC<LineComparisonProps> = ({
  //   ylabel,
  //   xlabel,
  title,
  cardProps,
  //   labels,
  //   data,
  defaultCurveStyle = "linear",
  divId,
  dateTime,
  fill = false,
  height = 250,
  //   visible,
  //   timeUnit: t,
  allowSelectLineStyle = false,
  lineData1,
  lineData2,
}) => {
  const [curveStyle, setCurveStyle] = useState<"linear" | "step" | "natural">(
    defaultCurveStyle || "linear"
  );

  const [timeUnit, setTimeUnit] = useState<"hour" | "day" | "week" | undefined>(
    lineData1.timeUnit?.target
  );
  const [xlabelState, setXlabelState] = useState<string>(lineData1.xlabel);

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

  const plottingData: Partial<Plotly.Data>[] = [];

  //   useEffect(() => {
  //     if (timeUnit) {
  //       plottingData.forEach((data: { x: number[] }) => {
  //         data.x = data.x.map((x) => {
  //           if (timeUnit === "hour") {
  //             return x;
  //           } else if (timeUnit === "day") {
  //             return t?.current === "hour" ? x / 24 : x;
  //           } else if (timeUnit === "week") {
  //             return t?.current === "hour"
  //               ? x / (24 * 7)
  //               : t?.current === "day"
  //               ? x / 7
  //               : x;
  //           } else {
  //             return x;
  //           }
  //         });
  //       });

  //       const newXLabel = "Time (" + capilatizeFirstLetter(timeUnit) + ")";
  //       setXlabelState(newXLabel);
  //     }
  //   }, [timeUnit, plottingData]);

  let x1 = lineData1.data.x as number[] | number[][] | Date[] | Date[][];
  let x2 = lineData2.data.x as number[] | number[][] | Date[] | Date[][];
  let individualX = false;

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

  if (x1[0] instanceof Array) {
    individualX = true;
  }

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
        // visible: visible ? (visible[i] ? true : "legendonly") : true,
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

  if (Array.isArray(lineData2.data.y[0])) {
    // multiple lines
    for (let i = 0; i < lineData2.labels.length; i++) {
      plottingData.push({
        x: individualX ? x2[i] : x2,
        y: lineData2.data.y[i],
        marker: { color: getColor(i + 3) },
        fill: fill ? "tozeroy" : "none",
        line: { shape: mapCurveStyle(curveStyle) },
        type: "scattergl",
        name: lineData2.labels[i],
        yaxis: "y2",
        // visible: visible ? (visible[i] ? true : "legendonly") : true,
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
      yaxis: "y2",
    });
  }

  return (
    <Card className="mx-auto" {...cardProps} ref={cardRef}>
      <Flex>
        <Title>{title}</Title>

        <div className="flex justify-center">
          {/* {timeUnit && (
            <Select
              onValueChange={(value) =>
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
          )} */}
          {allowSelectLineStyle && (
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
          )}
          {/* <DownloadButton
            data={{
              title,
              xlabel: xlabelState,
              ylabel,
              data: data,
              labels: labels,
            }}
            type="line"
            divId={divId}
          /> */}
        </div>
      </Flex>
      <div
        className={"mx-auto mt-8 ring-0 " + `h-[${height}px]`}
        style={{ height: `${height}px` }}
      >
        <Plot
          divId={divId}
          data={plottingData as object[]}
          layout={getLayout(theme, xlabelState, [
            lineData1.ylabel,
            lineData2.ylabel,
          ])}
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
  ylabels: string[]
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
      zerolinecolor:
        theme === "dark"
          ? "#rgba(75, 85, 99, 0.4)"
          : "rgba(209, 213, 219, 0.4)",
      title: {
        text: xlabel,
      },
    },
    yaxis: {
      gridcolor:
        theme === "dark"
          ? "#rgba(75, 85, 99, 0.4)"
          : "rgba(209, 213, 219, 0.4)",
      zerolinecolor:
        theme === "dark"
          ? "#rgba(75, 85, 99, 0.4)"
          : "rgba(209, 213, 219, 0.4)",
      showgrid: true,
      linecolor: "rgba(0, 0, 0, 0)",
      griddash: "dot",
      title: {
        text: ylabels[0],
      },
      hoverformat: ".2f",
    },
    yaxis2: {
      gridcolor:
        theme === "dark"
          ? "#rgba(75, 85, 99, 0.4)"
          : "rgba(209, 213, 219, 0.4)",
      zerolinecolor:
        theme === "dark"
          ? "#rgba(75, 85, 99, 0.4)"
          : "rgba(209, 213, 219, 0.4)",
      showgrid: true,
      linecolor: "rgba(0, 0, 0, 0)",
      griddash: "dot",
      overlaying: "y",
      side: "right",
      title: {
        text: ylabels[1],
      },
      hoverformat: ".2f",
    },
  };

  return layout as object; // fixing type error
};

const chartConfig = {
  responsive: true,
  displaylogo: false,
  showTips: false,
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

export default LineComparison;
