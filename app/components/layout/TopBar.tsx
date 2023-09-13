import Image from 'next/image';
import Link from 'next/link';

import { Menu } from '@mui/base';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import avatarMaxImg from '/public/images/avatarMax.png';
import logo from '/public/images/logo.svg';

const StyledMenu = styled((props: MenuProps) => <Menu {...props} />)(({ theme }) => ({
  '& .MuiMenu-listbox': {
    display: 'inline-flex',
    '& .MuiMenuItem-root': {
      borderRadius: '24px',
      marginRight: '24px',
    },
    '& .MuiMenuItem-root:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

export default function TopBar() {
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
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Link>
            </Box>

            <Stack direction="row" spacing={0}>
              <StyledMenu open>
                <MenuItem>
                  <Typography variant="body2">Projekte</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography variant="body2">Artikel</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography variant="body2">Backstage</Typography>
                </MenuItem>
              </StyledMenu>

              <Menu>
                <MenuItem>
                  <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} variant="dot">
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <Image src={avatarMaxImg} alt="avatar" fill sizes="33vw" />
                    </Avatar>
                  </StyledBadge>
                </MenuItem>
              </Menu>
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
