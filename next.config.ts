import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  output: isVercel ? "standalone" : (isProd ? "export" : undefined),
  distDir: isVercel ? undefined : (isProd ? "out" : undefined),
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["lucide-react"],
};

export default nextConfig;
