import Image from 'next/image';
import Link from 'next/link';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useUser } from '@/app/contexts/user-context';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import { Headers } from './Layout';
import LoggedInMenu from './LoggedInMenu';

import logo from '/public/images/logo.svg';

interface TopBarProps {
  pages: Headers[];
}

export default function TopBar({ pages }: TopBarProps) {
  const { user, isLoading } = useUser();

  const boxItemStyle = {
    borderRadius: '8px',
    minHeight: '100% !important',
    backgroundColor: 'inherit',
    display: 'flex',
    alignItems: 'center',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    ':active': {
      backgroundColor: theme.palette.primary.light,
    },
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: `blur(20px)`,
        ':hover': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          backdropFilter: `blur(20px)`,
        },
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box sx={{ width: 245, display: 'block' }}>
              <Link href="/">
                <Image
                  src={logo}
                  alt={m.components_layout_topBar_imageAlt()}
                  sizes="100vw"
                  style={{
                    width: '70%',
                    height: '70%',
                  }}
                />
              </Link>
            </Box>

            <nav>
              <Stack direction="row" spacing={5}>
                {pages.map((page) =>
                  page.link ? (
                    <Link key={page.text} style={{ textDecoration: 'none', color: 'white' }} href={page.link}>
                      <Box p={1} sx={boxItemStyle}>
                        <Typography variant="body2">{page.text}</Typography>
                      </Box>
                    </Link>
                  ) : (
                    <Box
                      key={page.text}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        pointerEvents: 'none',
                        backgroundColor: 'inherit',
                      }}
                    >
                      <Typography variant="body2" color="rgba(155,155,155,1)">
                        {page.text}
                      </Typography>
                    </Box>
                  ),
                )}
                {(user || isLoading) && <LoggedInMenu user={user} isUserLoading={isLoading} />}
              </Stack>
            </nav>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
