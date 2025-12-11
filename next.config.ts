import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['xlsx'],
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
