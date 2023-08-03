import Layout from "~/components/layout";
import React from "react";
import data from "~/api/digital-hospital/kpis.out.json";
import { transformApiData } from "~/api/digital-hospital/transform";
import SingleScenarioResult from "~/components/twins/digital-hospital/single-scenario-result";

const SingleScenarioPage = () => {
  const transformedData = transformApiData(data);

  return (
    <Layout>
      <SingleScenarioResult results={transformedData} />
    </Layout>
  );
};

export default SingleScenarioPage;
