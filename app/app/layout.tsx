'use client';
import React from 'react';
import type { Metadata } from 'next';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import theme from '../styles/theme';

import ThemeRegistry from './ThemeRegistry';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const metadata: Metadata = {
  title: 'InnoPlatte',
  viewport: { width: 'device-width', initialScale: 1 },
  themeColor: theme.palette.primary.main,
};

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          <ThemeRegistry options={{ key: 'mui' }}>{children}</ThemeRegistry>
        </ApolloProvider>
      </body>
    </html>
  );
}
