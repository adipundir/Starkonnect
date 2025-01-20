/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['api.dicebear.com', "media.licdn.com"],
  },
};

module.exports = nextConfig;
