import "./styles.css";

import dynamic from "next/dynamic";
export type { LineChartData, LineProps } from "./line";
export type { BarChartData, BarProps } from "./bar";
export type {
  LineComparsionData,
  LineComparisonProps,
} from "./line-comparison-chart";

import type { LineProps } from "./line";

export const LineChart = dynamic(() => import("./line"), {
  ssr: false,
});

export const BarChart = dynamic(() => import("./bar"), {
  ssr: false,
});

export const LineComparisonChart = dynamic(
  () => import("./line-comparison-chart"),
  {
    ssr: false,
  }
);

export const ScatterMap = dynamic(() => import("./scatter-map"), {
  ssr: false,
});
