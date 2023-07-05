import React from "react";
import { ScatterMap } from "~/components/charts";
import Layout from "~/components/layout";

const Map = () => {
  return (
    <Layout title="Map">
      <ScatterMap divId="map" title="Map" />
    </Layout>
  );
};

export default Map;
