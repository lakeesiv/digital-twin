import React from "react";
import { ScatterMap } from "charts";
import Layout from "~/components/layout";
import { env } from "~/env.mjs";

const Map = () => {
  return (
    <Layout title="Map">
      <ScatterMap divId="map" title="Map"
        mapboxAccessToken={
          env.NEXT_PUBLIC_MAPBOX_TOKEN || ""
        }
      />
    </Layout>
  );
};

export default Map;
