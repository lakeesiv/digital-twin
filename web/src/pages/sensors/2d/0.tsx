import { LineChart } from "charts";
import useSubscribeByAll from "~/api/sensor/useSubscribeAll";
import { DataPoint, Viz2D, Viz2DFilter } from "~/components/2d-viz";
import Layout from "~/components/layout";

const FloorZeroViz = () => {
  const { connectionStatus, messageHistory } = useSubscribeByAll();

  // filter location where floor is 0
  const floorZeroData = messageHistory.filter(
    (data: DataPoint) => data.location.floor === 0
  );

  return (
    <Layout>
      {connectionStatus === "Connected" && (
        <div className="flex flex-col space-y-8">
          <Viz2D floor="0" data={floorZeroData} />
          <Viz2DFilter floor="0" data={floorZeroData} />
          <Viz2DFilter floor="0" data={floorZeroData} />
          <Viz2DFilter floor="0" data={floorZeroData} />
        </div>
      )}
    </Layout>
  );
};

export default FloorZeroViz;
