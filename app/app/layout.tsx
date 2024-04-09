'use client';
import React, { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AppInsightsContext, AppInsightsErrorBoundary } from '@microsoft/applicationinsights-react-js';

import { NotificationContextProvider } from '@/app/contexts/notification-context';
import CustomToastContainer from '@/components/common/CustomToast';
import ErrorPage from '@/components/error/ErrorPage';
import theme from '@/styles/theme';
import { reactPlugin } from '@/utils/instrumentation/AppInsights';

import { UserContextProvider } from './contexts/user-context';
import { SWRProvider } from './swr-provider';
import ThemeRegistry from './ThemeRegistry';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const metadata: Metadata = {
  title: 'InnoVerse',
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <link rel="manifest" href="/manifest.json" />
        <title>InnoVerse</title>
        <meta name="description" content="***STRING_REMOVED***  Innovation Platform" />
      </head>
      <body>
        <AppInsightsErrorBoundary onError={() => <ErrorPage />} appInsights={reactPlugin}>
          <AppInsightsContext.Provider value={reactPlugin}>
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
          </AppInsightsContext.Provider>
        </AppInsightsErrorBoundary>
      </body>
    </html>
  );
}

export function AppLayout({ children }: PropsWithChildren) {
  return <NotificationContextProvider>{children}</NotificationContextProvider>;
}
