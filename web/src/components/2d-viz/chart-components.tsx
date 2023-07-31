import { Divider, Text } from "@tremor/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ui";
import { DataPoint } from ".";

const heatMapColorforValue = (value: number) => {
  const h = (1.0 - value) * 240;
  return `hsl(${h}, 100%, 50%)`;
};

interface HeatMapLegendProps {
  data: DataPoint[];
  selectedAttribute?: string | "all";
}

export const HeatMapLegend = ({
  data,
  selectedAttribute,
}: HeatMapLegendProps) => {
  if (!selectedAttribute || selectedAttribute === "all") {
    return null;
  }

  // only get the data points that have the selected attribute
  const filteredData = data.filter(
    (d) => d.payload[selectedAttribute] !== undefined
  );

  if (filteredData.length === 0) {
    return null;
  }

  // get the min and max values of the selected attribute
  const min = Math.min(
    ...filteredData.map((d) => d.payload[selectedAttribute] as number)
  );
  const max = Math.max(
    ...filteredData.map((d) => d.payload[selectedAttribute] as number)
  );

  const legendValues = [1, 0.75, 0.5, 0.25, 0].map(
    (value) => value * (max - min) + min
  );

  return (
    <div className="mx-4 flex flex-row items-center">
      <div className="h-[500px] w-4 overflow-hidden rounded-sm">
        <div
          className="h-full"
          style={{
            background: `linear-gradient(to bottom, ${[1, 0.75, 0.5, 0.25, 0]
              .map((value) => heatMapColorforValue(value))
              .join(", ")})`,
          }}
        ></div>
      </div>
      <div className="ml-2 flex h-[500px] flex-col justify-between text-sm">
        {legendValues.map((value, index) => (
          <Text key={index}>{value}</Text>
        ))}
      </div>
      {selectedAttribute && (
        <div className="ml-2 flex h-[500px] rotate-90 transform flex-col justify-evenly text-sm">
          <Text>{selectedAttribute}</Text>
        </div>
      )}
    </div>
  );
};

interface MarkerProps extends DataPoint {
  heatMapColorValue: number;
}

const Marker = ({
  location: { x, y },
  acp_id,
  acp_ts,
  payload,
  heatMapColorValue,
}: MarkerProps) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        bottom: `${y}px`,
      }}
    >
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <div
              className="h-3 w-3 transform rounded-full border-[1px] border-black bg-white transition duration-200 ease-in-out hover:scale-125 dark:border-white"
              style={{
                backgroundColor: heatMapColorforValue(heatMapColorValue),
              }}
            />
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="start"
            sideOffset={3}
            className="flex flex-col"
          >
            <div className="font-mono text-sm text-blue-500">{acp_id}</div>
            <div className="font-mono text-sm ">
              {new Date(acp_ts * 1000).toLocaleString()}
            </div>
            <Divider className="my-1" />
            <span className="whitespace-pre-wrap font-mono text-sm ">
              {JSON.stringify(payload, null, 2)}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

interface DisplayMarkersProps {
  data: DataPoint[];
  selectedAttribute?: string | "all";
}

export const DisplayMarkers = ({
  data,
  selectedAttribute,
}: DisplayMarkersProps) => {
  if (!selectedAttribute || selectedAttribute === "all") {
    return (
      <>
        {data.map((d, index) => (
          <Marker key={index} {...d} heatMapColorValue={1} />
        ))}
      </>
    );
  }

  // only get the data points that have the selected attribute
  const filteredData = data.filter(
    (d) => d.payload[selectedAttribute] !== undefined
  );

  // get the min and max values of the selected attribute
  const min = Math.min(
    ...filteredData.map((d) => d.payload[selectedAttribute] as number)
  );
  const max = Math.max(
    ...filteredData.map((d) => d.payload[selectedAttribute] as number)
  );

  return (
    <>
      {filteredData.map((d, index) => (
        <Marker
          key={index}
          {...d}
          heatMapColorValue={
            ((d.payload[selectedAttribute] as number) - min) / (max - min)
          }
        />
      ))}
    </>
  );
};
