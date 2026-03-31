import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  // When deploying to GitHub Pages at https://<user>.github.io/<repo>/, set
  // GITHUB_REPOSITORY env var (automatically set in GitHub Actions).
  // Leave unset for root-domain deploys or local dev.
  basePath: isProd && repoName ? `/${repoName}` : "",
  assetPrefix: isProd && repoName ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
  },
};

const withMDX = createMDX({
  // Add markdown plugins here if needed
  options: {},
});

export default withMDX(nextConfig);
