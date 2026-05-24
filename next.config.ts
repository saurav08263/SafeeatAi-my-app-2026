import type { NextConfig } from "next";

// For production: use "standalone" output (server-side rendering with API routes)
// Capacitor uses server.url to connect to the deployed server
const nextConfig: NextConfig = {
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,

  turbopack: {},

  headers: async () => [
    {
      source: "/manifest.json",
      headers: [
        {
          key: "Content-Type",
          value: "application/manifest+json",
        },
      ],
    },
    {
      source: "/sw.js",
      headers: [
        {
          key: "Content-Type",
          value: "application/javascript",
        },
        {
          key: "Service-Worker-Allowed",
          value: "/",
        },
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
      ],
    },
    {
      source: "/.well-known/assetlinks.json",
      headers: [
        {
          key: "Content-Type",
          value: "application/json",
        },
      ],
    },
  ],
};

export default nextConfig;
