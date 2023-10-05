'use client';
import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

import theme from '../styles/theme';

import { SWRProvider } from './swr-provider';
import ThemeRegistry from './ThemeRegistry';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const metadata: Metadata = {
  title: 'InnoPlatte',
  viewport: { width: 'device-width', initialScale: 1 },
  themeColor: theme.palette.primary.main,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Script
        src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
        data-website-id={`${process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}`}
      />
      <body>
        <SWRProvider>
          <ThemeRegistry options={{ key: 'mui' }}>{children}</ThemeRegistry>
        </SWRProvider>
      </body>
    </html>
  );
}
