import { Card, Flex, Title } from "@tremor/react";
import { useTheme } from "next-themes";
import Plotly from "plotly.js-cartesian-dist-min";
import React, { useEffect } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import DownloadButton from "./download";
import { getColor } from "./utils";

const Plot = createPlotlyComponent(Plotly as object);

export type BarGraphData = {
  title?: string; // optional
  xlabel: string;
  ylabel: string;
  data: {
    x: string[]; // categories
    labels: string[]; // each label is a line ["label1", "label2", "label3"]
    y: number[][]; // each array is a line [[label1_val, label2val, label3val], [...], [...]]
  };
};

interface BarProps extends BarGraphData {
  cardProps?: React.ComponentProps<typeof Card>;
  divId: string;
  extraBottomPadding?: number;
}

/**
 * A Plotly chart component that displays a bar graph.
 * @param {BarProps} props - The props object containing the chart data and configuration.
 * @param {string} props.ylabel - The label for the y-axis.
 * @param {string} props.xlabel - The label for the x-axis.
 * @param {string} [props.title] - The title of the chart (optional).
 * @param {React.ComponentProps<typeof Card>} [props.cardProps] - Additional props to pass to the Card component (optional).
 * @param {BarGraphData['data']} props.data - The data to be displayed on the chart.
 * @param {string} props.divId - The ID of the div element that will contain the chart.
 * @returns {JSX.Element} A Plotly chart component that displays a bar graph.
 */
const BarChart: React.FC<BarProps> = ({
  ylabel,
  xlabel,
  title,
  cardProps,
  data,
  divId,
  extraBottomPadding,
}) => {
  const { theme } = useTheme();
  // reference to the card to observe resize
  const cardRef = React.useRef<HTMLDivElement>(null);

  // observe resize of the card, and resize the plotly chart
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
      <div className="mx-auto mt-8 h-full pb-16 ring-0">
        <Plot
          divId={divId}
          data={plottingData as object[]}
          layout={getLayout(theme, xlabel, ylabel, extraBottomPadding)}
          useResizeHandler
          className="h-full w-full"
          config={chartConfig as object}
        />
      </div>
    </Card>
  );
};

const getLayout = (
  theme: string | undefined,
  xlabel: string,
  ylabel: string,
  extraBottomPadding?: number
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

export default BarChart;
