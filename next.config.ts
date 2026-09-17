import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Prisma must stay on the Node runtime and never be bundled for the edge.
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
