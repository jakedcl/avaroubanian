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
      { source: '/admin', destination: '/studio', permanent: false },
      { source: '/admin/:path*', destination: '/studio/:path*', permanent: false },
      // Shop is hidden until it has products. Temporary so it can come back.
      { source: '/shop', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
