import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

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
};

export default config;
