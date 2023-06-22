import Layout from "~/components/layout";
import Data from "~/data.json";
import LineChart from "~/components/charts/line";

export default function Home() {
  return (
    <Layout title="Digital Twin">
      {JSON.stringify(Data.bone_station.busy, null, 2)}
      <LineChart
        title="Bone Station Resources"
        y_label="Number of Busy Resources"
        data={{
          x: Data.bone_station.busy.t,
          y: Data.bone_station.busy.number_busy,
        }}
        defaultCurveStyle="step"
        x_label="Time (hrs)"
      />
    </Layout>
  );
}
