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
  async redirects() {
    return [
      { source: '/studio', destination: '/admin', permanent: false },
      { source: '/studio/:path*', destination: '/admin/:path*', permanent: false },
      // Shop is hidden until it has products. Temporary so it can come back.
      { source: '/shop', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
