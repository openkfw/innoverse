'use client';

import { PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AppInsightsContext, AppInsightsErrorBoundary } from '@microsoft/applicationinsights-react-js';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import { DailyCheckinContextProvider } from '@/app/contexts/daily-checkin-context';
import { MentionsContextProvider } from '@/app/contexts/mentions-context';
import { NotificationContextProvider } from '@/app/contexts/notification-context';
import { UserContextProvider } from '@/app/contexts/user-context';
import { SWRProvider } from '@/app/swr-provider';
import ThemeRegistry from '@/app/ThemeRegistry';
import CustomToastContainer from '@/components/common/CustomToast';
import ErrorPage from '@/components/error/ErrorPage';
import * as m from '@/src/paraglide/messages.js';
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
  { text: m.components_layout_layout_initiatives(), link: '/projects' },
  { text: m.components_layout_layout_news(), link: '/news' },
  { text: m.components_layout_layout_aiAssistant() },
];

function AppLayout({ children }: PropsWithChildren) {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <CustomToastContainer />
      <ThemeRegistry options={{ key: 'mui' }}>
        {isSmallScreen ? <TopBarMobile pages={pages} /> : <TopBar pages={pages} />}
        <Box display="flex" flexDirection="column" sx={{ minHeight: 'calc(100vh - 64px)' }}>
          <Box flexGrow={1}>{children}</Box>
          <Footer />
        </Box>
      </ThemeRegistry>
    </>
  );
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <AppInsightsErrorBoundary onError={() => <ErrorPage />} appInsights={reactPlugin}>
      <AppInsightsContext.Provider value={reactPlugin}>
        <SessionProvider>
          <SWRProvider>
            <MentionsContextProvider>
              <UserContextProvider>
                <DailyCheckinContextProvider>
                  <NotificationContextProvider>
                    <AppLayout>{children}</AppLayout>
                  </NotificationContextProvider>
                </DailyCheckinContextProvider>
              </UserContextProvider>
            </MentionsContextProvider>
          </SWRProvider>
        </SessionProvider>
      </AppInsightsContext.Provider>
    </AppInsightsErrorBoundary>
  );
}
