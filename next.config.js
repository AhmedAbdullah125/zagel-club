// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dashboard.scrp-sa.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "thecarrierpigeon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.thecarrierpigeon.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
