import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "fal.media",
      },
    ],
    unoptimized: true,
  },
  // Uncomment below for Capacitor static export
  // output: "export",
};

export default nextConfig;
