import { Divider } from "@tremor/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ui";
import { OverallPlan } from "~/components/floor-plans";
import Layout from "~/components/layout";
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
              className="h-3 w-3 transform rounded-full bg-white transition duration-200 ease-in-out hover:scale-125"
              style={{ backgroundColor: color }}
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
        </div>
      </div>
    </Layout>
  );
};

export default WS;
