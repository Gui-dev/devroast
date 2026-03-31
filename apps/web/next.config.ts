import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    hours: {
      stale: 3600,
      revalidate: 3600,
      expire: 3600,
    },
  },
  serverExternalPackages: ['@takumi-rs/core'],
}

export default nextConfig
