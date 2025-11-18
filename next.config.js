/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongodb']
  },
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
    responseLimit: false,
  },
}

module.exports = nextConfig