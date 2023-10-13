'use client';

import Box from '@mui/material/Box';

import theme from '@/styles/theme';

import Footer from './Footer';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        background: `linear-gradient(84deg, ${theme.palette.primary?.dark} 0%, ${theme.palette.primary?.light} 100%)`,
      }}
    >
      <TopBar />
      <Box>{children}</Box>
      <Footer />
    </div>
  );
}
