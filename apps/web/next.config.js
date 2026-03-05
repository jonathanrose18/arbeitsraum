/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@arbeitsraum/db'],
}

export default nextConfig
