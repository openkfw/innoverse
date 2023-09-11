'use client';
import React from 'react';
import type { Metadata } from 'next';

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
      <body>
        <SWRProvider>
          <ThemeRegistry options={{ key: 'mui' }}>{children}</ThemeRegistry>
        </SWRProvider>
      </body>
    </html>
  );
}
