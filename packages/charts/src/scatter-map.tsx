import { Card, Flex, Title, type CardProps } from "@tremor/react";
import { useTheme } from "next-themes";
import Plotly from "plotly.js";
import React, { useEffect } from "react";
import Plot from "react-plotly.js";
import { CHART_CONFIG, titleToId, useResizeObserver } from "./utils";

export interface ScatterMapProps {
  cardProps?: CardProps;
  divId?: string;
  title: string;
  mapboxAccessToken: string;
}

const ScatterMap: React.FC<ScatterMapProps> = ({
  title,
  cardProps,
  divId = titleToId(title),
  mapboxAccessToken,
}) => {
  const { theme } = useTheme();
  // reference to the card to observe resize
  const cardRef = React.useRef<HTMLDivElement>(null);

  // observe resize of the card, and resize the plotly chart
  useResizeObserver(cardRef, divId);

  const plottingData: Partial<Plotly.Data>[] = [];

  plottingData.push({
    type: "scattermapbox",
    lat: [40.7128, 40.8],
    lon: [-74.006, -74.2],
    mode: "markers",
    text: [10, 20],
  });

  return (
    <Card className="mx-auto min-h-[300px]" {...cardProps} ref={cardRef}>
      <Flex>
        <Title>{title}</Title>
        <div className="flex justify-center">
          {/* <DownloadButton
            divId={divId}
            data={{
              data: data,
              title: title,
              xlabel: xlabel,
              ylabel: ylabel,
            }}
            type="bar"
          /> */}
        </div>
      </Flex>
      <div className="mx-auto mt-8 h-full pb-4 ring-0">
        <Plot
          divId={divId}
          data={plottingData as object[]}
          layout={getLayout(theme)}
          useResizeHandler
          className="h-full w-full"
          config={{
            ...CHART_CONFIG,
            mapboxAccessToken: mapboxAccessToken,
          }}
        />
      </div>
    </Card>
  );
};

const getLayout = (theme: string | undefined) => {
  if (!theme) {
    theme = "light";
  }

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    mapbox: {
      style: theme === "dark" ? "dark" : "streets",
    },
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
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0,
    },
    xaxis: {
      showgrid: false,
      linecolor: "rgba(0, 0, 0, 0)",
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
      hoverformat: ".2f",
    },
  };

  return layout as object; // return as object to avoid type error
};

export default ScatterMap;
