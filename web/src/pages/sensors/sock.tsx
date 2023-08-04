import { LineChart } from "charts";
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
  return (
    <Layout>
      <div className="flex flex-col space-y-8">
        {/* <Viz2D data={data} /> */}
        {/* <Viz2DFilter data={data} /> */}
        <LineChart
          data={{
            x: [1, 2, 3, 4, 5],
            y: [
              [1, 2, 3, 4, 5],
              [3, 4, 5, 3, 3],
            ],
            labels: ["1", "2"],
            ymin: [
              [0.5, 1.5, 2.5, 3.5, 4.5],
              [2.5, 3.5, 4.5, 2.5, 2.5],
            ],
            ymax: [
              [1.5, 2.5, 3.5, 4.5, 5.5],
              [4.5, 5.5, 6.5, 4.5, 4.5],
            ],
          }}
          xlabel="x"
          ylabel="y"
          title="title"
        />
      </div>
    </Layout>
  );
};

export default WS;
