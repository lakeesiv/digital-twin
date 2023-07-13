/**
 * Download: Renders a download button for downloading chart data in different formats.
 *
 * @param {DownloadProps} props - The props object containing the chart data, chart type, and div ID.
 * @returns {JSX.Element} - A React component that renders a download button for downloading chart data in different formats.
 *
 * @description This file contains the Download component, which is responsible for rendering a download button for downloading chart data in different formats. The component takes in the chart data, chart type, and div ID as props and renders a dropdown menu with options to download the data in JSON, CSV, and PNG formats. The component also includes functions to download the data in the selected format and save it as a file. A divId prop is required to download the chart as a PNG.
 *
 * @example
 *
 * ```
 * import Download from '~/components/charts/download';
 *
 * const chartData = {...};
 * const chartType = 'line';
 * const divId = 'chart';
 *
 * function App() {
 *   return (
 *     <Download data={chartData} type={chartType} divId={divId} />
 *   );
 * }
 * ```
 *
 * @author
 * Lakee Sivaraya <ls914@cam.ac.uk>
 */

import React from "react";
import type { BarChartData } from "./bar";
import type { LineChartData } from "./line";
import { Button } from "ui";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "ui";
import Plotly from "plotly.js";

type DownloadFormats = "json" | "csv";

interface DownloadProps {
  data: BarChartData | LineChartData;
  type: "bar" | "line";
  divId: string;
}

const DownloadButton: React.FC<DownloadProps> = ({ data, type, divId }) => {
  return (
    <DropdownMenu>
      <Button variant="outline" className="h-[30px]" asChild>
        <DropdownMenuTrigger className="mx-4 h-[30px]  focus:outline-none focus:ring-transparent">
          <Download size={16} className="px-0" />
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent>
        <DropdownMenuLabel>Download as</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            let resultingData = "";

            if (type === "line") {
              const lineData = data as LineChartData;

              resultingData = downloadLineData(lineData, "json");
            }

            if (type === "bar") {
              const barData = data as BarChartData;
              resultingData = downloadBarData(barData, "json");
            }

            const element = document.createElement("a");
            const file = new Blob([resultingData], {
              type: "text/plain",
            });
            element.href = URL.createObjectURL(file);
            element.download = getTitle(data, "data") + "." + "json";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
          }}
        >
          JSON
        </DropdownMenuItem>
        {data.data.x[0] instanceof Array ? null : (
          <DropdownMenuItem
            onClick={() => {
              let resultingData = "";

              if (type === "line") {
                const lineData = data as LineChartData;
                resultingData = downloadLineData(lineData, "csv");
              }

              if (type === "bar") {
                const barData = data as BarChartData;
                resultingData = downloadBarData(barData, "csv");
              }

              const element = document.createElement("a");
              const file = new Blob([resultingData], {
                type: "text/plain",
              });
              element.href = URL.createObjectURL(file);
              element.download = getTitle(data, "data") + "." + "csv";
              document.body.appendChild(element); // Required for this to work in FireFox
              element.click();
            }}
          >
            CSV
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={async () => {
            await downloadPNG(divId, getTitle(data, "plot"));
          }}
        >
          PNG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type ExportedData = {
  [key: string]: (string | number)[];
};

const downloadLineData = (
  data: LineChartData,
  downloadFormat: DownloadFormats
) => {
  const resultingData: ExportedData = {};
  const xlabel = data.xlabel;

  if (data.data.x[0] instanceof Array) {
    const x = data.data.x as number[][];
    for (let i = 0; i < x.length; i++) {
      const id = xlabel + " " + data.labels[i];
      resultingData[id] = x[i];
    }
  } else {
    resultingData[xlabel] = data.data.x as number[];
  }

  const labels = data.labels;

  if (data.labels.length === 1) {
    resultingData[labels[0]] = data.data.y as number[];
  } else {
    for (let i = 0; i < data.labels.length; i++) {
      resultingData[labels[i]] = data.data.y[i] as number[];
    }
  }

  if (downloadFormat === "json") {
    return JSON.stringify(resultingData, null, 2);
  } else if (downloadFormat === "csv") {
    if (data.data.x[0] instanceof Array) {
      return "Error CSV not supported for multiple x values";
    } else {
      let csv = xlabel + "," + labels.join(",") + "\n";
      data.data.x = data.data.x as number[];

      for (let i = 0; i < data.data.x.length; i++) {
        csv += `${data.data.x[i]}` + ",";

        if (data.labels.length === 1) {
          csv += `${data.data.y[i] as number}` + ",";
        } else {
          for (let j = 0; j < data.labels.length; j++) {
            const curr = data.data.y[j] as number[];
            csv += `${curr[i]}` + ",";
          }
        }

        csv += "\n";
      }
      return csv;
    }
  } else {
    return "Failed to download data";
  }
};

const downloadBarData = (
  data: BarChartData,
  downloadFormat: DownloadFormats
) => {
  const resultingData: ExportedData = {};
  const categories = data.data.x;
  resultingData["Categories"] = categories;

  const labels = data.data.labels;

  for (let i = 0; i < data.data.labels.length; i++) {
    resultingData[labels[i]] = data.data.y[i];
  }

  if (downloadFormat === "json") {
    return JSON.stringify(resultingData, null, 2);
  } else if (downloadFormat === "csv") {
    let csv = "Categories," + labels.join(",") + "\n";
    for (let i = 0; i < data.data.x.length; i++) {
      csv += `${data.data.x[i]}` + ",";

      for (let j = 0; j < data.data.labels.length; j++) {
        const curr = data.data.y[j];
        csv += `${curr[i]}` + ",";
      }

      csv += "\n";
    }
    return csv;
  } else {
    return "Failed to download data";
  }
};

const downloadPNG = async (divId: string, title: string) => {
  const plotlyDiv = document.getElementById(divId) as HTMLElement;

  type TPlotly = {
    toImage: (
      plotlyDiv: HTMLElement,
      format: { format: string }
    ) => Promise<string>;
  };

  const plotly = Plotly as unknown as TPlotly;

  const url = await plotly.toImage(plotlyDiv, { format: "png" });

  const link = document.createElement("a");
  link.download = title + ".png";
  link.href = url;
  link.click();

  return true;
};

const getTitle = (data: LineChartData | BarChartData, fallback: string) => {
  let title = data.title || fallback;

  if (typeof data.title !== "string") {
    title = fallback;
  }

  return title;
};

export default DownloadButton;
