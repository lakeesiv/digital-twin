import React from "react";
import Layout from "~/components/layout";
import StatusBage from "~/components/status-badge";

const JobsPage = () => {
  return (
    <Layout title="Jobs">
      <div className="flex">
        <StatusBage message="Job In Progress" status="active" color="green" />
      </div>
    </Layout>
  );
};

export default JobsPage;
