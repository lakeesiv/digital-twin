// import { Sidebar } from "~/components/sidebar";
import Head from "next/head";
import React from "react";
import Menu from "~/components/layout/menu";

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>{title ? title : "App"}</title>
        <meta name="description" content="UROP Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full  min-h-screen w-full flex-col border-t ">
        {/* <main className="grid  h-full min-h-screen w-full border-t lg:grid-cols-5"> */}
        {/* <Sidebar className="hidden lg:block" /> */}
        <div className="flex h-16 self-start  px-4">{mounted && <Menu />}</div>
        <div className="col-span-3 h-full px-4 py-6 lg:col-span-4 lg:border-l lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
