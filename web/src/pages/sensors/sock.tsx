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

function heatMapColorforValue(value: number) {
  var h = (1.0 - value) * 240;
  return "hsl(" + h + ", 100%, 50%)";
}

const HeatMapLegend = () => {
  const legendValues = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div className="mx-4 flex flex-row items-center">
      <div className="h-[500px] w-4 overflow-hidden rounded-sm">
        <div
          className="h-full"
          style={{
            background: `linear-gradient(to bottom, ${legendValues
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
    </div>
  );
};

const Dot = ({ x, y }: { color: string; x: number; y: number }) => {
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
              style={{ backgroundColor: heatMapColorforValue(x / 500) }}
            />
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="start"
            sideOffset={3}
            className="flex flex-col"
          >
            <div>sensor-id</div>
            <Divider className="my-1" />
            <span className="whitespace-pre-wrap font-mono text-sm text-blue-500">
              {JSON.stringify({ x, y }, null, 2)}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const vals = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];

const WS = () => {
  return (
    <Layout>
      <div className="flex flex-row items-center">
        <div className="relative">
          <OverallPlan className="relative bottom-0 left-0 -z-50" />
          <Dot x={50} y={50} color="red" />
          {vals.map((x) => (
            <Dot
              key={x}
              x={Math.random() * 500}
              y={Math.random() * 500}
              color="red"
            />
          ))}
        </div>
        <HeatMapLegend />
      </div>
    </Layout>
  );
};

export default WS;
