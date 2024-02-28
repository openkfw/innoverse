'use client';

import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';

import theme from '@/styles/theme';

import Footer from './Footer';
import TopBar from './TopBar';
import TopBarMobile from './TopBarMobile';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div
      style={{
        background: `linear-gradient(84deg, ${theme.palette.primary?.dark} 0%, ${theme.palette.primary?.light} 100%)`,
      }}
    >
      {isSmallScreen ? <TopBarMobile /> : <TopBar />}
      <Box>{children}</Box>
      <Footer />
    </div>
  );
}
