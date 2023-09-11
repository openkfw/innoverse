/** @type {import('next').NextConfig} */

const withFonts = require('next-fonts');

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
};

module.exports = withFonts(nextConfig);
