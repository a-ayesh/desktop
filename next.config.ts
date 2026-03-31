import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
// Project sites live at https://<user>.github.io/<repo>/. User/org root sites use a
// repo named <user>.github.io and are served at https://<user>.github.io/ (no subpath).
const isGitHubUserOrOrgRootSite = repoName.endsWith(".github.io");
const baseSegment =
  isProd && repoName && !isGitHubUserOrOrgRootSite ? `/${repoName}` : "";

const resolvedBasePath = process.env.BASE_PATH ?? baseSegment;
const resolvedAssetPrefix =
  process.env.ASSET_PREFIX ??
  (resolvedBasePath ? `${resolvedBasePath.replace(/\/$/, "")}/` : "");

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  // GITHUB_REPOSITORY is set in GitHub Actions. Override path with BASE_PATH / ASSET_PREFIX if needed.
  basePath: resolvedBasePath,
  assetPrefix: resolvedAssetPrefix,
  images: {
    unoptimized: true,
  },
};

const withMDX = createMDX({
  // Add markdown plugins here if needed
  options: {},
});

export default withMDX(nextConfig);
