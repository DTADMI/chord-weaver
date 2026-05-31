import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
    staleTimes: { dynamic: 30, static: 180 },
  },
};

export default nextConfig;
