import { LineChart } from "charts";
import useSubscribeByAll from "~/api/sensor/useSubscribeAll";
import { DataPoint, Viz2D, Viz2DFilter } from "~/components/2d-viz";
import Layout from "~/components/layout";

const FloorOneViz = () => {
  const { connectionStatus, messageHistory } = useSubscribeByAll();

  // filter location where floor is 0
  const data = messageHistory.filter(
    (data: DataPoint) => data.location.floor === 1
  );

  return (
    <Layout>
      {connectionStatus === "Connected" && (
        <div className="flex flex-col space-y-8">
          <Viz2D floor="1" data={data} />
          <Viz2DFilter floor="1" data={data} />
          <Viz2DFilter floor="1" data={data} />
          <Viz2DFilter floor="1" data={data} />
        </div>
      )}
    </Layout>
  );
};

export default FloorOneViz;
