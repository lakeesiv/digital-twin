const colors = [
  "#6b64ef",
  "#FF6B6B",
  "#FFE66D",
  "#8CE8C3",
  "#FFA8E2",
  "#A8D0E6",
  "#FFCBB2",
  "#B2B2B2",
  "#F7DC6F",
  "#D2B4DE",
  "#F1948A",
  "#A9DFBF",
  "#F5B7B1",
  "#D7BDE2",
  "#A3E4D7",
  "#F0B27A",
];

export const getColor = (index: number) => {
  return colors[index % colors.length];
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
