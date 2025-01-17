import { NextConfig } from 'next';
import { Configuration } from 'webpack';
import { clientConfig } from './config/client';
import { serverConfig } from './config/server';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { paraglide } from '@inlang/paraglide-next/plugin';

const withFonts = require('next-fonts');

const bundleAnalyzer = withBundleAnalyzer();

const nextConfig: NextConfig = {
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
      {
        hostname: '127.0.0.1',
        pathname: '/uploads/**',
        port: '1337',
      },
      {
        hostname: 'strapi',
        pathname: '/uploads/**',
        port: '1337',
      },
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
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];
    config.module.rules.push(
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /^.*\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/chunks/images/[name][ext]',
        },
      },
    );
    if (isServer) {
      config.resolve = config.resolve || { fallback: {} };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        os: false,
        fs: false,
        child_process: false,
        path: false,
      };
    }
    return config;
  },
  i18n: {
    locales: ['de'],
    defaultLocale: 'de',
  },
};

export default serverConfig.ANALYZE === true
  ? bundleAnalyzer(
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
