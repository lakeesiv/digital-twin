import Layout from "~/components/layout";
import { DataTable } from "~/components/sensors/data-table";
import { columns } from "~/components/sensors/columns";
import data from "~/mock";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout title="Home">
      <DataTable columns={columns} data={data} />
    </Layout>
  );
}
