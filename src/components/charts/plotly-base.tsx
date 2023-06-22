import React, { useState } from "react";
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
const Plot = createPlotlyComponent(Plotly as object);

interface LineProps {
  ylabel: string;
  xlabel: string;
  title?: string;
  cardProps?: React.ComponentProps<typeof Card>;
  data: {
    x: number[];
    y: number[];
  };
  defaultCurveStyle?: "linear" | "step" | "natural";
}

const PlotlyChart: React.FC<LineProps> = ({
  ylabel,
  xlabel,
  title,
  cardProps,
  data,
  defaultCurveStyle = "linear",
}) => {
  const [curveStyle, setCurveStyle] = useState<"linear" | "step" | "natural">(
    defaultCurveStyle || "linear"
  );

  const { theme } = useTheme();
  const layout: Partial<Plotly.Layout> = {
    autosize: true,
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
      title: {
        text: ylabel,
      },
    },
  };

  return (
    <Card className="mx-auto" {...cardProps}>
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
      <Card className="mx-auto mt-8 h-[250px] ring-0">
        <Plot
          divId="plotlyChart"
          data={[
            {
              x: data.x,
              y: data.y,
              marker: { color: "#6b64ef" },
              fill: "tozeroy",
              line: { shape: mapCurveStyle(curveStyle) },

              type: "scattergl",
            },
          ]}
          layout={layout as object}
          useResizeHandler
          className="h-full w-full"
        />
      </Card>
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
