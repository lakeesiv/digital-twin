import React from "react";
import Plotly from "plotly.js-cartesian-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { useTheme } from "next-themes";
import { Card } from "@tremor/react";

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
}

const PlotlyChart: React.FC<LineProps> = ({
  ylabel,
  xlabel,
  title,
  cardProps,
  data,
}) => {
  //   useEffect(() => {
  //     Plotly.Plots.resize("plotlyChart");
  //   }, [sideBarOpen]);
  const { theme } = useTheme();
  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    title: title,
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    margin: {
      l: 40,
      r: 20,
      b: 40,
      t: 40,
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
    <Card className="mx-auto mt-8 h-[300px]" {...cardProps}>
      <Plot
        divId="plotlyChart"
        data={[
          {
            x: data.x,
            y: data.y,
            marker: { color: "red" },
            fill: "tozeroy",
            line: { shape: "hv" },

            type: "scattergl",
          },
        ]}
        layout={layout as object}
        useResizeHandler
        className="h-full w-full"
      />
    </Card>
  );
};

export default PlotlyChart;
