import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  basePath: '/spring2026',
  assetPrefix: '/spring2026/',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
