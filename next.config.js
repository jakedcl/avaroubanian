/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
    ],
  },
  typescript: {
    // During deployment, type checking will be handled separately
    ignoreBuildErrors: true,
  },
  eslint: {
    // During deployment, linting will be handled separately
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 