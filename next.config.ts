import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo-name>, so the build sets
// NEXT_PUBLIC_BASE_PATH=/itzfizz-hero-animation. Locally it stays empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
