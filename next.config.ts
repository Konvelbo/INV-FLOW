import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: (isProd && !process.env.VERCEL) ? "export" : undefined,
  distDir: "out",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["lucide-react"],
};

export default nextConfig;
