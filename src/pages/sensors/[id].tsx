import Layout from "~/components/layout";
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
    <Layout title={(router.query.id as string) || "Sensor"}>
      <h1 className="mb-2 font-mono text-2xl font-bold">
        Sensor ID: {router.query.id}
      </h1>

      <Chart />
    </Layout>
  );
}
