import { useEffect } from "react";
import Plotly from "plotly.js";

const colors = [
  "rgba(255, 107, 107, 1)",
  "rgba(107, 100, 239, 1)",
  "rgba(255, 230, 109, 1)",
  "rgba(140, 232, 195, 1)",
  "rgba(255, 168, 226, 1)",
  "rgba(168, 208, 230, 1)",
  "rgba(255, 203, 178, 1)",
  "rgba(178, 178, 178, 1)",
  "rgba(247, 220, 111, 1)",
  "rgba(210, 180, 222, 1)",
  "rgba(241, 148, 138, 1)",
  "rgba(169, 223, 191, 1)",
  "rgba(245, 183, 177, 1)",
  "rgba(215, 189, 226, 1)",
  "rgba(163, 228, 215, 1)",
  "rgba(240, 178, 122, 1)",
];

export const getColor = (index: number, opacity: number = 1) => {
  const color = colors[index % colors.length];
  return color.replace("1)", `${opacity})`);
};

export const titleToId = (title: string | JSX.Element) => {
  // replace all non-alphanumeric characters with dashes and lowercase

  if (typeof title === "object") {
    title = "plotly-chart";
  }

  return title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
};

export const CHART_CONFIG = {
  responsive: true,
  displaylogo: false,
  showTips: false,
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

export const mapCurveStyle = (
  style: "linear" | "step" | "natural" | "smooth"
) => {
  switch (style) {
    case "linear":
      return "linear";
    case "step":
      return "hv";
    case "natural":
      return "spline";
    case "smooth":
      return "spline";
    default:
      return "linear";
  }
};

export const capilatizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const useResizeObserver = (
  cardRef: React.RefObject<HTMLDivElement>,
  divId: string
) => {
  useEffect(() => {
    const Lib = Plotly as {
      Plots: { resize: (el: string) => void };
      setPlotConfig: (config: object) => void;
    };

    if (!cardRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      Lib.Plots.resize(divId);
    });
    resizeObserver.observe(cardRef.current);
    return () => resizeObserver.disconnect(); // clean up
  }, [cardRef, divId]);
};
