/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // Allow Google profile images
  },
  // Enable static exports
  output: 'standalone',
}

module.exports = nextConfig
