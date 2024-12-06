const { clientConfig } = require('./config/client');
const { serverConfig } = require('./config/server');

const withFonts = require('next-fonts');
const withBundleAnalyzer = require('@next/bundle-analyzer')();
const { paraglide } = require('@inlang/paraglide-next/plugin');

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
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
      { hostname: 'strapi', pathname: '/uploads/**', port: '1337' },
    ],
  },
  async rewrites() {
    if (serverConfig.STAGE === 'build') return [];
    return [
      {
        source: '/api/strapi',
        destination: clientConfig.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT,
      },
      {
        source: '/api/strapi/upload',
        destination: `${clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}/api/upload`,
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
    config.module.rules.push(
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        // Supports only images which are not optimized by next
        test: /^.*\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/chunks/images/[name][ext]',
        },
      },
    );
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
  experimental: {
    staleTimes: {
      dynamic: 3,
      static: 180,
    },
  },
  i18n: {
    locales: ['de'],
    defaultLocale: 'de',
  },
};

module.exports =
  serverConfig.ANALYZE === true
    ? withBundleAnalyzer(
      paraglide({
        paraglide: {
          project: './project.inlang',
          outdir: './src/paraglide',
        },
        ...nextConfig,
      }),
    )
    : withFonts(
      paraglide({
        paraglide: {
          project: './project.inlang',
          outdir: './src/paraglide',
        },
        ...nextConfig,
      }),
    );
