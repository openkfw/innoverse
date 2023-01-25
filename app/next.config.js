/** @type {import('next').NextConfig} */

const withFonts = require("next-fonts");

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withFonts(nextConfig);
