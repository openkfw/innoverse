import Image from 'next/image';
import Link from 'next/link';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useUser } from '@/app/contexts/user-context';
import theme from '@/styles/theme';

import LoggedInMenu from './LoggedInMenu';

import logo from '/public/images/logo.svg';

type Headers = {
  text: string;
  link?: string;
};

const pages: Headers[] = [
  { text: 'Initiativen', link: '/#initiativen' },
  { text: 'News', link: '/news' },
  { text: 'AI Assistant' },
];

export default function TopBar() {
  const { user, isLoading } = useUser();

  const menuItemStyle = {
    borderRadius: '8px',
    minHeight: '100% !important',
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
                  alt="***STRING_REMOVED***  Logo"
                  sizes="100vw"
                  style={{
                    width: '70%',
                    height: '70%',
                  }}
                />
              </Link>
            </Box>

            <nav>
              <Stack direction="row" spacing={3}>
                {pages.map((page) =>
                  page.link ? (
                    <Link key={page.text} style={{ textDecoration: 'none', color: 'white' }} href={page.link}>
                      <MenuItem sx={menuItemStyle}>
                        <Typography variant="body2">{page.text}</Typography>
                      </MenuItem>
                    </Link>
                  ) : (
                    <MenuItem
                      key={page.text}
                      sx={{ borderRadius: '8px', '&:hover': { backgroundColor: 'inherit' }, pointerEvents: 'none' }}
                    >
                      <Typography variant="body2" color="rgba(155,155,155,1)">
                        {page.text}
                      </Typography>
                    </MenuItem>
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
