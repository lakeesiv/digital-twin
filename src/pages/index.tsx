import { Button } from "~/ui/button";
import Layout from "~/components/layout";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout title="Home">
      <Button>hello</Button>
    </Layout>
  );
}
