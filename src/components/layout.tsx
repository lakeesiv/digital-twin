import { Sidebar } from "~/components/sidebar";
import Head from "next/head";
import React from "react";

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title ? title : "App"}</title>
        <meta name="description" content="UROP Project" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="grid  h-full min-h-screen w-full border-t lg:grid-cols-5">
        <Sidebar className="hidden lg:block" />
        <div className="col-span-3 h-full px-4 py-6 lg:col-span-4 lg:border-l lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
