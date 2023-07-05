import React from "react";
import { ScatterMap } from "~/components/charts";
import Layout from "~/components/layout";
import { LineChart, LineComparison } from "~/components/charts";
import type { LineChartData } from "~/components/charts/line";
import GridLayout from "~/components/layout/grid-layout";

const Map = () => {
  const data1: LineChartData = {
    title: "Line 1",
    labels: ["1"],
    xlabel: "xlabel1",
    ylabel: "ylabel1",
    data: {
      x: [1, 2, 3, 4, 5, 6, 7, 8],
      y: [12, 34, 56, 78, 90, 12, 34, 56],
    },
  };

  const data2: LineChartData = {
    title: "Line 2",
    labels: ["2"],
    xlabel: "xlabel2",
    ylabel: "ylabel2",
    data: {
      x: [10, 20, 30, 40, 50, 60, 70, 80],
      y: [770, 120, 340, 560, 780, 900, 120, 340],
    },
  };

  const data3 = {
    title: "Line 3",
    labels: ["3"],
    xlabel: "xlabel3",
    ylabel: "ylabel3",
    data: {
      x: [100, 200, 300, 400, 500, 600, 700, 800],
      y: [7700, 1200, 3400, 5600, 7800, 9000, 1200, 3400],
    },
  };

  const data4 = {
    title: "Line 4",
    labels: ["4"],
    xlabel: "xlabel4",
    ylabel: "ylabel4",
    data: {
      x: [1, 2, 3],
      y: [1, 2, 3],
    },
  };

  return (
    <Layout title="Map">
      <LineComparison lineData1={data1} lineData2={data4} title="Comparison" />
      <GridLayout>
        <LineChart {...data1} />
        <LineChart {...data2} />
        <LineChart {...data3} />
        <LineChart {...data4} />
      </GridLayout>

      {/* <ScatterMap divId="map" title="Map" /> */}
    </Layout>
  );
};

export default Map;
