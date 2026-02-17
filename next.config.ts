import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Temporarily disabled due to compatibility issues with Clerk authentication routes
  // Clerk routes (sign-in, sign-up) use request-time APIs (cookies, headers) that
  // are not compatible with cacheComponents prerendering in Next.js 16
  // See: https://nextjs.org/docs/messages/blocking-route
  // TODO: Re-enable when Clerk/Next.js provides better compatibility
  cacheComponents: true,

  experimental: {
    // Disable server component HMR cache so edits to Server Components
    // trigger an immediate reload instead of stale cached RSC payload
    serverComponentsHmrCache: false,
  },
};

export default nextConfig;
