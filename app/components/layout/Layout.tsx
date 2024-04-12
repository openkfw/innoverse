'use client';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import { AppLayout } from '@/app/layout';
import theme from '@/styles/theme';

import Footer from './Footer';
import TopBar from './TopBar';
import TopBarMobile from './TopBarMobile';

interface LayoutProps {
  children: React.ReactNode;
}

export type Headers = {
  text: string;
  link?: string;
};

const pages: Headers[] = [
  { text: 'Initiativen', link: '/#initiativen' },
  { text: 'News', link: '/news' },
  { text: 'AI Assistant' },
];

export default function Layout({ children }: LayoutProps) {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppLayout>
      <div
        style={{
          background: `linear-gradient(84deg, ${theme.palette.primary?.dark} 0%, ${theme.palette.primary?.light} 100%)`,
        }}
      >
        {isSmallScreen ? <TopBarMobile pages={pages} /> : <TopBar pages={pages} />}
        <Box>{children}</Box>
        <Footer />
      </div>
    </AppLayout>
  );
}
