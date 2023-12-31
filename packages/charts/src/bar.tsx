/**
 * bar.tsx: A component that defines a bar chart.
 * !! IMPORTANT !!
 * DO NOT IMPORT THIS FILE DIRECTLY. Instead, import the component from 'index.tsx'.
 *
 * @description This file exports a React functional component that renders a bar chart using the Plotly.js library. The component takes in data in the form of an object with categories, labels, and values, and renders a bar chart with the specified data. The component also includes a download button.
 *
 * @see {@link https://plotly.com/javascript/bar-charts/}
 *
 * @example
 *
 *
 * @author
 * Lakee Sivaraya <ls914@cam.ac.uk>
 */

import { Card, Flex, Title, type CardProps } from "@tremor/react";
import { useTheme } from "next-themes";
import Plotly from "plotly.js";
import React from "react";
import Plot from "react-plotly.js";
import DownloadButton from "./download";
import { CHART_CONFIG, getColor, titleToId, useResizeObserver } from "./utils";

export type BarChartData = {
  title: string;
  xlabel: string;
  ylabel: string;
  data: {
    x: string[] | number[]; // categories
    labels: string[]; // each label is a line ["label1", "label2", "label3"]
    y: number[][]; // each array is a line [[label1_val, label2val, label3val], [...], [...]]
    ymin?: number[][]; // same format as y
    ymax?: number[][]; // same format as y
  };
};

export interface BarProps extends BarChartData {
  cardProps?: CardProps;
  divId?: string;
  height?: number;
  extraBottomPadding?: number;
  stacked?: boolean;
}

const BarChart: React.FC<BarProps> = ({
  ylabel,
  xlabel,
  title,
  cardProps,
  data,
  divId = titleToId(title),
  extraBottomPadding,
  stacked = false,
  height = 250,
}) => {
  const { theme } = useTheme();
  // reference to the card to observe resize
  const cardRef = React.useRef<HTMLDivElement>(null);

  useResizeObserver(cardRef, divId);

  const plottingData: Partial<Plotly.Data>[] = [];

  for (let i = 0; i < data.labels.length; i++) {
    // for each label, create a bar
    plottingData.push({
      x: data.x,
      y: data.y[i],
      marker: {
        color: getColor(i),
      },
      type: "bar",
      name: data.labels[i],
      error_y: {
        type: "data",
        symmetric: false,
        array: data.ymax
          ? data.ymax[i].map((v, j) => v - data.y[i][j])
          : undefined,
        arrayminus: data.ymin
          ? data.ymin[i].map((v, j) => data.y[i][j] - v)
          : undefined,
      },
    });
  }

  return (
    <Card className="mx-auto min-h-[300px]" {...cardProps} ref={cardRef}>
      <Flex>
        <Title>{title}</Title>
        <div className="flex justify-center">
          <DownloadButton
            divId={divId}
            data={{
              data: data,
              title: title,
              xlabel: xlabel,
              ylabel: ylabel,
            }}
            type="bar"
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
          layout={getLayout(theme, xlabel, ylabel, extraBottomPadding, stacked)}
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
  extraBottomPadding?: number,
  stacked?: boolean
) => {
  if (!theme) {
    theme = "light";
  }

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    barmode: stacked ? "stack" : "group",
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
      r: 0,
      b: 40 + (extraBottomPadding || 0),
      t: 10,
      pad: 0,
    },
    xaxis: {
      showgrid: false,
      linecolor: "rgba(0, 0, 0, 0)",
      title: {
        text: xlabel,
      },
      hoverformat: ".2f",
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

  return layout as object; // return as object to avoid type error
};

export default BarChart;
