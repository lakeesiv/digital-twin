import { LineChart } from "charts";
import useSubscribeByAll from "~/api/sensor/useSubscribeAll";
import { DataPoint, Viz2D, Viz2DFilter } from "~/components/2d-viz";
import Layout from "~/components/layout";

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

const WS = () => {
  const { connectionStatus, messageHistory } = useSubscribeByAll();

  return (
    <Layout>
      {connectionStatus === "Connected" && (
        <div className="flex flex-col space-y-8">
          <Viz2D data={messageHistory} />
          <Viz2DFilter data={messageHistory} />
        </div>
      )}
    </Layout>
  );
};

export default WS;
