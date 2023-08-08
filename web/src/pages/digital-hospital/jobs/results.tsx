import Layout from "~/components/layout";
import React from "react";
import data from "~/api/digital-hospital/kpis.out.json";
import { transformApiData } from "~/api/digital-hospital/transform";
import SingleScenarioResult from "~/components/twins/digital-hospital/single-scenario-result";
import { GetServerSideProps } from "next";
import { getScenario } from "~/api/digital-hospital";

interface Props {
  results: ReturnType<typeof transformApiData>;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id as string;
  const data = await getScenario(parseInt(id));

  return {
    props: {
      results: JSON.parse(JSON.stringify(data)) as ReturnType<
        typeof transformApiData
      >,
    },
  };
};

const SingleScenarioPage: React.FC<Props> = ({ results }) => {
  return (
    <Layout>
      <SingleScenarioResult results={results} />
    </Layout>
  );
};

export default SingleScenarioPage;
