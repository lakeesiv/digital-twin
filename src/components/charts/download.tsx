import React from "react";
import type { BarGraphData } from "./bar";
import type { LineGraphData } from "./line";
import { Button } from "~/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu";
import Plotly from "plotly.js-cartesian-dist-min";

type DownloadFormats = "json" | "csv";

interface DownloadProps {
  data: BarGraphData | LineGraphData;
  type: "bar" | "line";
  divId: string;
}

const DownloadButton: React.FC<DownloadProps> = ({ data, type, divId }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mx-4 h-[30px]  focus:outline-none focus:ring-transparent">
        <Button variant="outline" className="h-[30px]">
          <Download size={16} className="px-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Download as</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            let resultingData = "";

            if (type === "line") {
              const lineData = data as LineGraphData;

              resultingData = downloadLineData(lineData, "json");
            }

            if (type === "bar") {
              const barData = data as BarGraphData;
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
        <DropdownMenuItem
          onClick={() => {
            let resultingData = "";

            if (type === "line") {
              const lineData = data as LineGraphData;
              resultingData = downloadLineData(lineData, "csv");
            }

            if (type === "bar") {
              const barData = data as BarGraphData;
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
  data: LineGraphData,
  downloadFormat: DownloadFormats
) => {
  const resultingData: ExportedData = {};
  const xlabel = data.xlabel;
  resultingData[xlabel] = data.data.x;

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
    let csv = xlabel + "," + labels.join(",") + "\n";
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
  } else {
    return "Failed to download data";
  }
};

const downloadBarData = (
  data: BarGraphData,
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

  const plotly = Plotly as TPlotly;

  const url = await plotly.toImage(plotlyDiv, { format: "png" });

  const link = document.createElement("a");
  link.download = title + ".png";
  link.href = url;
  link.click();

  return true;
};

const getTitle = (data: LineGraphData | BarGraphData, fallback: string) => {
  let title = data.title || fallback;

  if (typeof data.title !== "string") {
    title = fallback;
  }

  return title as string;
};

export default DownloadButton;
