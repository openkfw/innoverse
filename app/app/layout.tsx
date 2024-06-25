import React from 'react';
import type { Metadata } from 'next';
import { LanguageProvider } from '@inlang/paraglide-next';

import Layout from '@/components/layout/Layout';
import * as m from '@/src/paraglide/messages.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const metadata: Metadata = {
  title: 'InnoVerse',
  viewport: { width: 'device-width', initialScale: 1 },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <html lang="de">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#0067A0" />
          <link rel="manifest" href="/manifest.json" />
          <title>{m.app_layout_title()}</title>
          <meta name="description" content={m.app_layout_content()} />
        </head>
        <body style={{ background: 'linear-gradient(90deg, rgb(0, 66, 103) 0%, rgb(0, 90, 140) 100%)' }}>
          <Layout>{children}</Layout>
        </body>
      </html>
    </LanguageProvider>
  );
}
