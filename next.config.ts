import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['sanity'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
