const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

const basePath = process.env.GITHUB_ACTIONS ? "/digital-twin" : "";

module.exports = withNextra({
  transpilePackages: ["charts"],
  images: {
    unoptimized: true,
  },
  basePath: basePath,
  output: "export",
});
