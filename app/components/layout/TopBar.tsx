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

const pages = ['Initiativen', 'News', 'Backstage'];

export default function TopBar() {
  const { user, isLoading } = useUser();

  const menuItemStyle = {
    borderRadius: '8px',
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

        // todo - hide until design for smaller screens
        [theme.breakpoints.down('sm')]: {
          display: 'none',
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
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Link>
            </Box>

            <Stack direction="row" spacing={3}>
              {pages.map((page) => (
                <MenuItem key={page} sx={menuItemStyle}>
                  <Typography variant="body2">{page}</Typography>
                </MenuItem>
              ))}

              {(user || isLoading) && <LoggedInMenu user={user} isUserLoading={isLoading} />}
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
