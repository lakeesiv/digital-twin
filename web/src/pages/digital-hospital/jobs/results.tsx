import Layout from "~/components/layout";
import React from "react";
import SingleScenarioResult from "~/components/twins/digital-hospital/single-scenario-result";
import { GetServerSideProps } from "next";
import { getScenario } from "~/api/digital-hospital";
import { SimulationResults } from "~/api/config";

interface Props {
  results: SimulationResults;
  error: boolean;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id as string;
  try {
    const data = await getScenario(parseInt(id));

    return {
      props: {
        results: JSON.parse(JSON.stringify(data)) as SimulationResults, // We need to do this because Next.js doesn't support sending objects as props
        error: false,
      },
    };
  } catch (error) {
    return {
      props: {
        results: null,
        error: true,
      },
    };
  }
};

const SingleScenarioPage: React.FC<Props> = ({ results, error }) => {
  return (
    <Layout>
      {error ? (
        <div className="mt-8">
          <p>
            There was an error fetching the scenario. Please ensure that the
            Simulation Server is running and ensure the jobId is valid.
          </p>
        </div>
      ) : (
        <SingleScenarioResult results={results} />
      )}
    </Layout>
  );
};

export default SingleScenarioPage;
