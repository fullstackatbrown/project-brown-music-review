import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgix.cosmicjs.com",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
