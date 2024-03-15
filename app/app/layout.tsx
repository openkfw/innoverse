'use client';
import React, { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import { NotificationContextProvider } from '@/app/contexts/notification-context';
import CustomToastContainer from '@/components/common/CustomToast';
import theme from '@/styles/theme';

import { UserContextProvider } from './contexts/user-context';
import { SWRProvider } from './swr-provider';
import ThemeRegistry from './ThemeRegistry';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const metadata: Metadata = {
  title: 'InnoBuddy',
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
      {process.env.NEXT_PUBLIC_UMAMI_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
        <Script
          src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
          data-website-id={`${process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}`}
        />
      )}
      <body>
        <ApolloProvider client={client}>
          <SessionProvider>
            <SWRProvider>
              <UserContextProvider>
                <CustomToastContainer />
                <ThemeRegistry options={{ key: 'mui' }}>{children}</ThemeRegistry>
              </UserContextProvider>
            </SWRProvider>
          </SessionProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}

export function AppLayout({ children }: PropsWithChildren) {
  return <NotificationContextProvider>{children}</NotificationContextProvider>;
}
