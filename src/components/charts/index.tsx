import dynamic from "next/dynamic";

export const LineChart = dynamic(() => import("./line"), {
  ssr: false,
});

export const BarChart = dynamic(() => import("./bar"), {
  ssr: false,
});
