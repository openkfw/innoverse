/** @type {import('next').NextConfig} */

const withFonts = require('next-fonts');

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
        pathname: '/uploads/**',
        port: '1337',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
      },
      {
        hostname: 'secure.gravatar.com',
        pathname: '/**',
        port: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/strapi',
        destination: process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT,
      },
      {
        source: '/api/strapi/upload',
        destination: `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}/api/upload`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/fonts/:font',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
  env: {
    NEXT_PUBLIC_STRAPI_TOKEN: process.env.NEXT_PUBLIC_STRAPI_TOKEN,
  },
};

module.exports = withFonts(nextConfig);
