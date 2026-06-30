import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['picsum.photos', 'api.dicebear.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@radix-ui/react-select'],
  },
};

export default nextConfig;
