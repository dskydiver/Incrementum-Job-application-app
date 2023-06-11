/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.preferRelative = true
    return config
  },
  reactStrictMode: true,
  experimental: {
    transpilePackages: ['ui'],
  },
}

module.exports = nextConfig
