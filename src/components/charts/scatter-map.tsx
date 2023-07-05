import { Card, Flex, Title } from "@tremor/react";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import DownloadButton from "./download";
import { getColor } from "./utils";
import Plotly from "plotly.js";
import Plot from "react-plotly.js";

interface ScatterMapProps {
  cardProps?: React.ComponentProps<typeof Card>;
  divId: string;
  extraBottomPadding?: number;
  title: string;
}

const ScatterMap: React.FC<ScatterMapProps> = ({
  title,
  cardProps,
  divId,
  extraBottomPadding,
}) => {
  const { theme } = useTheme();
  // reference to the card to observe resize
  const cardRef = React.useRef<HTMLDivElement>(null);

  // observe resize of the card, and resize the plotly chart
  useEffect(() => {
    const Lib = Plotly as {
      Plots: { resize: (el: string) => void };
      setPlotConfig: (config: object) => void;
    };

    Lib.setPlotConfig({
      mapboxAccessToken:
        "pk.eyJ1Ijoic2FtYXJ5Y2FybG9zIiwiYSI6ImNrcm5tY3J4eDA0ZGMyd3BnM2J0Zm5jZ2gifQ.2hW6KZGxJ1QhYVQVZ5P8RQ",
    });

    if (!cardRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      Lib.Plots.resize(divId);
    });
    resizeObserver.observe(cardRef.current);
    return () => resizeObserver.disconnect(); // clean up
  }, [divId]);

  const plottingData: Partial<Plotly.Data>[] = [];

  plottingData.push({
    type: "scattermapbox",
    lat: [40.7128],
    lon: [-74.006],
    mode: "markers",
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
      <div className="mx-auto mt-8 h-full pb-16 ring-0">
        <Plot
          divId={divId}
          data={plottingData as object[]}
          layout={getLayout(theme, extraBottomPadding)}
          useResizeHandler
          className="h-full w-full"
          config={chartConfig as object}
        />
      </div>
    </Card>
  );
};

const getLayout = (theme: string | undefined, extraBottomPadding?: number) => {
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

const chartConfig = {
  responsive: true,
  showTips: false,
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

export default ScatterMap;
