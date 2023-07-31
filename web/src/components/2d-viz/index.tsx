import { FC } from "react";
import { OverallPlan } from "../floor-plans";
import { DisplayMarkers, HeatMapLegend } from "./chart-components";

export type DataPoint = {
  acp_id: string;
  acp_ts: number;
  payload: { [key: string]: number };
  location: {
    x: number;
    y: number;
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

export const Viz2DFilter: FC<Viz2DFilterProps> = ({ data }) => {};
