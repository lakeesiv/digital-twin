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
import { CHART_CONFIG, getColor, titleToId, mapCurveStyle } from "./utils";
import Plotly from "plotly.js";
import Plot from "react-plotly.js";

interface TimeUnit {
  current: "hour" | "day" | "week";
  target: "hour" | "day" | "week";
  options: ("hour" | "day" | "week")[];
}

export type LineChartData = {
  title: string | JSX.Element; // title can be a string or a JSX element
  xlabel: string;
  ylabel: string;
  data: {
    x: number[] | number[][]; // either one array of x values (global), or an array of arrays of x values for each line
    y: number[][] | number[]; // each array is a line [[...], [...], [...]]  or single line [...]
  };
  labels: string[]; // each label is a line ["label1", "label2", "label3"]
  visible?: boolean[]; // each boolean is a line [true, false, true]
  timeUnit?: TimeUnit;
};

interface LineProps extends LineChartData {
  cardProps?: React.ComponentProps<typeof Card>;
  defaultCurveStyle?: "linear" | "step" | "natural";
  divId?: string;
  dateTime?: boolean;
  fill?: boolean;
  height?: number;
  allowSelectLineStyle?: boolean;
}

/**
 * A line chart component that uses Plotly.js to render a line chart.
 * @param {LineProps} props - The props for the LineChart component.
 * @param {string} props.ylabel - The label for the y-axis.
 * @param {string} props.xlabel - The label for the x-axis.
 * @param {string} [props.title] - The title for the chart (optional).
 * @param {React.ComponentProps<typeof Card>} [props.cardProps] - The props for the Card component (optional).
 * @param {string[]} props.labels - The labels for the data lines.
 * @param {LineChartData['data']} props.data - The data for the chart.
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
  divId = titleToId(title),
  dateTime,
  fill = false,
  height = 250,
  visible,
  timeUnit: t,
  allowSelectLineStyle = false,
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
        type: "scattergl",
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
      type: "scattergl",
      name: labels[0],
    });
  }

  return (
    <Card className="mx-auto" {...cardProps} ref={cardRef}>
      <Flex>
        <Title>{title}</Title>

        <div className="flex justify-center">
          {timeUnit && (
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
          )}
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
          layout={getLayout(theme, xlabelState, ylabel)}
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
        text: ylabel,
      },
      hoverformat: ".2f",
    },
  };

  return layout as object; // fixing type error
};

export default LineChart;
