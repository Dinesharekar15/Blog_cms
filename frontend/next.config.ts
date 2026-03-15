import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true, // We already verify ESLint before deployment
  },
  typescript: {
    ignoreBuildErrors: true, // We already verify TypeScript before deployment
  }
};

export default nextConfig;
