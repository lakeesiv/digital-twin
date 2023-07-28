import { Divider } from "@tremor/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ui";
import { OverallPlan } from "~/components/floor-plans";
import Layout from "~/components/layout";

function heatMapColorforValue(value: number) {
  var h = (1.0 - value) * 240;
  return "hsl(" + h + ", 100%, 50%)";
}

const HeatMapLegend = () => {
  const legendValues = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="heat-map-legend mt-4 flex flex-col items-center">
      <div className="gradient-bar h-4 w-52 overflow-hidden rounded-lg">
        <div
          className="gradient h-full"
          style={{
            background: `linear-gradient(to right, ${legendValues
              .map((value) => heatMapColorforValue(value))
              .join(", ")})`,
          }}
        ></div>
      </div>
      <div className="legend-labels mt-2 flex w-52 justify-between text-sm">
        {legendValues.map((value, index) => (
          <div key={index} className="legend-label">
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

const Dot = ({ color, x, y }: { color: string; x: number; y: number }) => {
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

const WS = () => {
  return (
    <Layout>
      <div>
        <div className="relative">
          <OverallPlan className="relative bottom-0 left-0 -z-50" />
          <Dot color="red" x={500} y={0} />
          <Dot color="red" x={500} y={500} />
          <Dot color="red" x={200} y={250} />
          <Dot color="red" x={0} y={250} />
        </div>
      </div>
    </Layout>
  );
};

export default WS;
