const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

module.exports = withNextra({
  transpilePackages: ["charts"],
  images: {
    unoptimized: true,
  },
  basePath: "/digital-twin",
  output: "export",
});
