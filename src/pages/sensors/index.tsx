import Layout from "~/components/layout";
import { DataTable } from "~/components/sensors/data-table";
import { columns } from "~/components/sensors/columns";
import data from "~/mock";
import { useState, useEffect } from "react";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Layout title="Home">
      {mounted && <DataTable columns={columns} data={data} />}
    </Layout>
  );
}
