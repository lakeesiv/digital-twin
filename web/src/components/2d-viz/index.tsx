import { FC, useState } from "react";
import { OverallPlan } from "../floor-plans";
import { DisplayMarkers, HeatMapLegend } from "./chart-components";
import { FacetedFilterButton } from "ui";
import { Card } from "@tremor/react";

export type DataPoint = {
  acp_id: string;
  acp_ts: number;
  payload: { [key: string]: number };
  location: {
    x: number; // [0, 100]
    y: number; // [0, 100]
  };
};

interface Viz2DProps {
  data: DataPoint[];
  selectedAttribute?: string;
}

export const Viz2D: FC<Viz2DProps> = ({ data, selectedAttribute }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="relative">
        <OverallPlan className="relative bottom-0 left-0" />
        <DisplayMarkers data={data} selectedAttribute={selectedAttribute} />
      </div>
      <HeatMapLegend data={data} selectedAttribute={selectedAttribute} />
    </div>
  );
};

interface Viz2DFilterProps {
  data: DataPoint[];
}

export const Viz2DFilter: FC<Viz2DFilterProps> = ({ data }) => {
  const allAttributes = data.reduce((acc, d) => {
    Object.keys(d.payload).forEach((key) => {
      if (!acc.includes(key)) {
        acc.push(key);
      }
    });
    return acc;
  }, [] as string[]);

  const [selectedAttribute, setSelectedAttribute] = useState<string[]>([]);

  return (
    <div>
      <FacetedFilterButton
        filters={allAttributes}
        selectedFilters={selectedAttribute}
        setSelectedFilters={setSelectedAttribute}
        limit={1}
        title={selectedAttribute.length === 0 ? "Select an attribute" : ""}
      />
      {selectedAttribute.length !== 0 ? (
        <div className="flex flex-row items-center">
          <div className="relative">
            <OverallPlan className="relative bottom-0 left-0" />
            <DisplayMarkers
              data={data}
              selectedAttribute={selectedAttribute[0]}
            />
          </div>
          <HeatMapLegend data={data} selectedAttribute={selectedAttribute[0]} />
        </div>
      ) : (
        <Card className="mt-4 flex h-[500px] w-[500px] flex-col justify-evenly text-center text-2xl font-semibold">
          Select an attribute to display
        </Card>
      )}
    </div>
  );
};
