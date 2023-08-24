import Image from 'next/image';
import Link from 'next/link';

import { Menu } from '@mui/base';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import logo from '/public/logo.svg';

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

export default function TopBar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: `blur(20px)`,
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
            <Box sx={{ width: 200, display: 'block' }}>
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

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <StyledMenu open={true}>
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
            </Box>
            <Box>
              <Menu>
                <MenuItem>
                  <Avatar
                    alt="Avatar"
                    src="https://source.boringavatars.com/beam/120/Stefan?colors=264653,f4a261,e76f51"
                    variant="circular"
                  />
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
