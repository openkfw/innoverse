import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import theme from '@/styles/theme';

import UserMenu from './UserMenu';

import avatarMaxImg from '/public/images/avatarMax.png';
import logo from '/public/images/logo.svg';

const pages = ['Projekte', 'Artikel', 'Backstage'];

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

export default function TopBar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

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
              <IconButton sx={menuItemStyle} onClick={handleOpenUserMenu}>
                <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} variant="dot">
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <Image src={avatarMaxImg} alt="avatar" fill sizes="33vw" />
                  </Avatar>
                </StyledBadge>
              </IconButton>
            </Stack>
            <UserMenu anchorElUser={anchorElUser} setAnchorElUser={setAnchorElUser} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
