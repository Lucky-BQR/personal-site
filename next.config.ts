import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: process.env.GITHUB_PAGES === 'true' ? '/personal-site' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/personal-site' : '',
};

export default nextConfig;
