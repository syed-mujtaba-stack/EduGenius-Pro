import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output configuration for Vercel
  output: 'standalone',

  // Images configuration
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

export default nextConfig;
