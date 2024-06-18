'use client';

import { PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AppInsightsContext, AppInsightsErrorBoundary } from '@microsoft/applicationinsights-react-js';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import { NotificationContextProvider } from '@/app/contexts/notification-context';
import { UserContextProvider } from '@/app/contexts/user-context';
import { SWRProvider } from '@/app/swr-provider';
import ThemeRegistry from '@/app/ThemeRegistry';
import CustomToastContainer from '@/components/common/CustomToast';
import ErrorPage from '@/components/error/ErrorPage';
import theme from '@/styles/theme';
import { reactPlugin } from '@/utils/instrumentation/AppInsights';

import Footer from './Footer';
import TopBar from './TopBar';
import TopBarMobile from './TopBarMobile';

export type Headers = {
  text: string;
  link?: string;
};

const pages: Headers[] = [
  { text: 'Initiativen', link: '/#initiativen' },
  { text: 'News', link: '/newsFeed' },
  { text: 'AI Assistant' },
];

function AppLayout({ children }: PropsWithChildren) {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box>
      <CustomToastContainer />
      <ThemeRegistry options={{ key: 'mui' }}>
        {isSmallScreen ? <TopBarMobile pages={pages} /> : <TopBar pages={pages} />}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <Box>{children}</Box>
          <Footer />
        </Box>
      </ThemeRegistry>
    </Box>
  );
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <AppInsightsErrorBoundary onError={() => <ErrorPage />} appInsights={reactPlugin}>
      <AppInsightsContext.Provider value={reactPlugin}>
        <SessionProvider>
          <SWRProvider>
            <UserContextProvider>
              <NotificationContextProvider>
                <AppLayout>{children}</AppLayout>
              </NotificationContextProvider>
            </UserContextProvider>
          </SWRProvider>
        </SessionProvider>
      </AppInsightsContext.Provider>
    </AppInsightsErrorBoundary>
  );
}
