import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: ["ffmpeg-static", "sharp"],
};

export default nextConfig;
