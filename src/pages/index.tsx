import Head from "next/head";
import Link from "next/link";
import { Button } from "~/ui/button";
import { api } from "~/utils/api";
import Nav from "~/components/nav";
import Layout from "~/components/layout";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout title="Home">
      <Button></Button>
    </Layout>
  );
}
