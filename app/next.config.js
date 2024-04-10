/** @type {import('next').NextConfig} */

const withFonts = require('next-fonts');

const nextConfig = {  
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      allowedForwardedHosts: ["***URL_REMOVED***"],
      allowedOrigins: ["***URL_REMOVED***"]
    }
  },
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
      { hostname: '127.0.0.1', pathname: '/uploads/**', port: '1337' },
    ],
  },
  experimental: {
    instrumentationHook: true,
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
  webpack: function (config, { isServer }) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    if (isServer) {
      // required for @azure/monitor-opentelemetry-exporter to work
      config.resolve.fallback ??= {};
      config.resolve.fallback.os = false;
      config.resolve.fallback.fs = false;
      config.resolve.fallback.child_process = false;
      config.resolve.fallback.path = false;
    }
    return config;
  },
};

module.exports = withFonts(nextConfig);
