import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Google et les navigateurs demandent souvent /favicon.ico → servir le logo
      { source: "/favicon.ico", destination: "/logo-share.png" },
    ];
  },
};

export default nextConfig;
