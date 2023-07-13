import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <strong>Digital Twin Frontend Docs</strong>,
  project: {
    link: "https://github.com/lakeesiv/digital-twin",
  },
  footer: {
    text: "Digital Twin Frontend - Lakee Sivaraya",
  },
  editLink: {
    text: "",
  },
  feedback: {
    content: "",
  },
  useNextSeoProps: () => ({
    titleTemplate: "%s - DT Frontend",
  }),
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  head: function useHead() {
    const config = useConfig<{ description?: string; image?: string }>();
    const description =
      config.frontMatter.description ||
      "Digital Twin Frontend - Lakee Sivaraya";
    return (
      <>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="og:title" content={`${config.title} – DT Frontend`} />
        <meta name="apple-mobile-web-app-title" content="DT Frontend" />
      </>
    );
  },
};

export default config;
