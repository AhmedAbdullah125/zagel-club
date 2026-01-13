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
        hostname: "Zagel.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.Zagel.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
