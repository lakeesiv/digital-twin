import React from "react";
import { ScatterMap } from "~/components/charts";
import Layout from "~/components/layout";
import { LineChart, LineComparison } from "~/components/charts";
import type { LineChartData } from "~/components/charts/line";
import GridLayout from "~/components/layout/grid-layout";
import FacetedFilterButton from "~/ui/facted-filter-button";
import { Card } from "@tremor/react";

const Map = () => {
  const [filters, setFilters] = React.useState<string[]>([]);

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

  const allData = [data1, data2, data3, data4];
  const allTitles = allData.map((d) => d.title);

  return (
    <Layout title="Map">
      <Card>
        <div className="mb-4">
          <FacetedFilterButton
            filters={allTitles as string[]}
            selectedFilters={filters}
            setSelectedFilters={setFilters}
            title="Select Two Lines"
            limit={2}
          />
        </div>
        {filters.length === 2 ? (
          <LineComparison
            lineData1={
              allData.find((d) => d.title === filters[0]) as LineChartData
            }
            lineData2={
              allData.find((d) => d.title === filters[1]) as LineChartData
            }
            // timeUnit={{
            //   current: "hour",
            //   target: "day",
            //   options: ["hour", "day", "week"],
            // }}
            title="Comparison"
          />
        ) : (
          <Card className="py-40 text-center text-2xl font-semibold ">
            Select two lines to compare
          </Card>
        )}
      </Card>
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
