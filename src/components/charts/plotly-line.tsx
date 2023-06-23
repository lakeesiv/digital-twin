import React, { useEffect, useState } from "react";
import Plotly from "plotly.js-cartesian-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { useTheme } from "next-themes";
import { Card, Title, Flex } from "@tremor/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "~/ui/select";
import { Button } from "~/ui/button";
import { Download } from "lucide-react";
import type { LineGraphData } from "./types";
import { getColor } from "./utils";

const Plot = createPlotlyComponent(Plotly as object);

interface LineProps extends LineGraphData {
  cardProps?: React.ComponentProps<typeof Card>;
  defaultCurveStyle?: "linear" | "step" | "natural";
  divId: string;
}

const PlotlyChart: React.FC<LineProps> = ({
  ylabel,
  xlabel,
  title,
  cardProps,
  labels,
  data,
  defaultCurveStyle = "linear",
  divId,
}) => {
  const [curveStyle, setCurveStyle] = useState<"linear" | "step" | "natural">(
    defaultCurveStyle || "linear"
  );

  const { theme } = useTheme();
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      const Lib = Plotly as { Plots: { resize: (el: string) => void } };
      Lib.Plots.resize(divId);
    });
    resizeObserver.observe(cardRef.current);
    return () => resizeObserver.disconnect(); // clean up
  }, [divId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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

  const plottingData: Partial<Plotly.Data>[] = [];

  for (let i = 0; i < labels.length; i++) {
    plottingData.push({
      x: data.x,
      y: data.y[i],
      marker: { color: getColor(i) },
      fill: "tozeroy",
      line: { shape: mapCurveStyle(curveStyle) },
      type: "scattergl",
      name: labels[i],
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
          <Button
            className="ml-4 h-[30px] "
            variant="secondary"
            onClick={() => {
              // download data as JSON
              //   return alert("This feature is not yet implemented");
              //   const element = document.createElement("a");
              //   const file = new Blob([JSON.stringify(parsedData)], {
              //     type: "text/plain",
              //   });
              //   element.href = URL.createObjectURL(file);
              //   element.download = "data.json";
              //   document.body.appendChild(element); // Required for this to work in FireFox
              //   element.click();
            }}
          >
            <Download size={16} className="px-0" />
          </Button>
        </div>
      </Flex>
      <div className="mx-auto mt-8 h-[250px] ring-0">
        <Plot
          divId={divId}
          data={plottingData as object[]}
          layout={layout as object}
          useResizeHandler
          className="h-full w-full"
          config={{
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
          }}
        />
      </div>
    </Card>
  );
};
const capilatizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

export default PlotlyChart;
