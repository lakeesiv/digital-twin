import Layout from "~/components/layout";
import { Card } from "@tremor/react";
import { useRouter } from "next/router";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const router = useRouter();

  return (
    <Layout title="Home">
      <Card>
        <h1 className="text-2xl font-bold">
          Sensor Visualizer: {router.query.id}
        </h1>
      </Card>
    </Layout>
  );
}
