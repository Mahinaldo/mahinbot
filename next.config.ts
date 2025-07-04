import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  /* config options here */
};

// next.config.js
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
