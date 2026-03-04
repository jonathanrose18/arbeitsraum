/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@arbeitsraum/auth', '@arbeitsraum/db'],
}

export default nextConfig
