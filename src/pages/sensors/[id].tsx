import Layout from "~/components/layout";
import { Card } from "@tremor/react";
import { useRouter } from "next/router";
import Chart from "~/components/chart";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Layout title="Home">
      <Card>
        <h1 className="text-2xl font-bold">
          Sensor Visualizer: {router.query.id}
        </h1>
        <Chart />
      </Card>
    </Layout>
  );
}
