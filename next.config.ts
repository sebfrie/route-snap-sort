import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Skip static page generation errors - app works in development and production runtime
  staticPageGenerationTimeout: 180,
};

export default nextConfig;
