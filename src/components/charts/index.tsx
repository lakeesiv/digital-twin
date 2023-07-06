import dynamic from "next/dynamic";

export const LineChart = dynamic(() => import("./line"), {
  ssr: false,
});

export const BarChart = dynamic(() => import("./bar"), {
  ssr: false,
});

export const ScatterMap = dynamic(() => import("./scatter-map"), {
  ssr: false,
});

export const LineComparisonChart = dynamic(
  () => import("./line-comparison-chart"),
  {
    ssr: false,
  }
);
