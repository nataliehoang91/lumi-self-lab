import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,

  experimental: {
    // Disable server component HMR cache so edits to Server Components
    // trigger an immediate reload instead of stale cached RSC payload
    serverComponentsHmrCache: false,
  },
};

export default nextConfig;
