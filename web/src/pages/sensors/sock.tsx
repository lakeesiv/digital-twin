import { Divider, Text } from "@tremor/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ui";
import { OverallPlan } from "~/components/floor-plans";
import Layout from "~/components/layout";

type DataPoint = {
  acp_id: string;
  acp_ts: number;
  payload: { [key: string]: number };
  location: {
    x: number;
    y: number;
  };
};

const data: DataPoint[] = [
  {
    acp_id: "sensor-1",
    acp_ts: 1629782400,
    payload: {
      temperature: 25.0,
      humidity: 50.0,
    },
    location: {
      x: 200,
      y: 200,
    },
  },
  {
    acp_id: "sensor-2",
    acp_ts: 1629782500,
    payload: {
      temperature: 26.0,
      humidity: 30.0,
    },
    location: {
      x: 300,
      y: 500,
    },
  },
  {
    acp_id: "sensor-e",
    acp_ts: 1629782700,
    payload: {
      temperature: 28.0,
      humidity: 31.0,
    },
    location: {
      x: 0,
      y: 60,
    },
  },
];

const heatMapColorforValue = (value: number) => {
  const h = (1.0 - value) * 240;
  return `hsl(${h}, 100%, 50%)`;
};

interface HeatMapLegendProps {
  data: DataPoint[];
  selectedAttribute?: string;
}

const HeatMapLegend = ({ data, selectedAttribute }: HeatMapLegendProps) => {
  if (!selectedAttribute) {
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

interface DotProps extends DataPoint {
  heatMapColorValue: number;
}

const Dot = ({
  location: { x, y },
  acp_id,
  acp_ts,
  payload,
  heatMapColorValue,
}: DotProps) => {
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
  selectedAttribute?: string;
}

const DisplayMarkers = ({ data, selectedAttribute }: DisplayMarkersProps) => {
  if (!selectedAttribute) {
    return (
      <>
        {data.map((d, index) => (
          <Dot key={index} {...d} heatMapColorValue={1} />
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
        <Dot
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

const WS = () => {
  return (
    <Layout>
      <div className="flex flex-row items-center">
        <div className="relative">
          <OverallPlan className="relative bottom-0 left-0" />
          <DisplayMarkers data={data} selectedAttribute="temperature" />
        </div>
        <HeatMapLegend data={data} selectedAttribute="temperature" />
      </div>
    </Layout>
  );
};

export default WS;
