import { LineChart } from "charts";
import useSubscribeByAll from "~/api/sensor/useSubscribeAll";
import { DataPoint, Viz2D, Viz2DFilter } from "~/components/2d-viz";
import Layout from "~/components/layout";

const FloorAll = () => {
  const { connectionStatus, messageHistory } = useSubscribeByAll();

  return (
    <Layout>
      {connectionStatus === "Connected" && (
        <div className="flex flex-col space-y-8">
          <Viz2D floor="all" data={messageHistory} />
          <Viz2DFilter floor="all" data={messageHistory} />
          <Viz2DFilter floor="all" data={messageHistory} />
          <Viz2DFilter floor="all" data={messageHistory} />
        </div>
      )}
    </Layout>
  );
};

export default FloorAll;
