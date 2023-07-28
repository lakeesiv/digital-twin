import Layout from "~/components/layout";
import Image from "next/image";
import { OverallPlan } from "~/components/floor-plans";

const Dot = ({ color, x, y }: { color: string; x: number; y: number }) => (
  <div
    className="h-3 w-3 transform rounded-full bg-white 
    transition duration-200 ease-in-out hover:scale-125
    "
    style={{
      backgroundColor: color,
      position: "absolute",
      top: `${y}px`,
      left: `${x}px`,
    }}
  />
);

const WS = () => {
  return (
    <Layout>
      <div>
        <div className="relative">
          <OverallPlan className="relative bottom-0 left-0 z-0" />
          <Dot color="red" x={20} y={0} />
        </div>
      </div>
    </Layout>
  );
};

export default WS;
