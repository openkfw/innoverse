'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { UserSession } from '@/common/types';
import { clientConfig } from '@/config/client';
import * as m from '@/src/paraglide/messages.js';

interface UserMenuProps {
  user: UserSession;
  anchorElUser: HTMLElement | null;
  setAnchorElUser: (anchor: HTMLElement | null) => void;
}

export default function UserMenu(props: UserMenuProps) {
  const { user, anchorElUser, setAnchorElUser } = props;

  const open = Boolean(anchorElUser);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Menu
      anchorEl={anchorElUser}
      open={open}
      onClose={handleCloseUserMenu}
      onClick={handleCloseUserMenu}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{ style: { width: 220, marginTop: 16 } }}
    >
      <Typography variant="body2" color="text.primary" sx={{ mx: 2, my: 1 }}>
        {user.name}
      </Typography>
      <Typography variant="body2" color="text.primary" sx={{ mx: 2, my: 1, fontSize: 13 }}>
        {user.email}
      </Typography>
      <Divider sx={{ mx: 2, my: 1 }} />
      <MenuItem>
        <Link href={clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT} target="_blank" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" color="text.primary">
            {m.components_layout_userMenu_contentEditor()}
          </Typography>
        </Link>
      </MenuItem>
      <Link href="/userProfile" style={{ textDecoration: 'none', color: 'common.white' }}>
        <MenuItem sx={listItemStyles}>
          <Typography variant="body2" color="text.primary">
            {m.components_layout_userMenu_profile()}
          </Typography>
        </MenuItem>
      </Link>

      {/* <MenuItem component={Link} to="/profile">
        <Typography variant="body2" color="text.primary">
          {m.components_layout_userMenu_profile()}
        </Typography>
      </MenuItem> */}
      <MenuItem disabled>
        <Typography variant="body2" color="text.primary">
          {m.components_layout_userMenu_notification()}
        </Typography>
        <Badge
          badgeContent={4}
          color="secondary"
          sx={{
            ml: 2,
            '& .MuiBadge-colorSecondary': {
              color: 'common.white',
            },
          }}
        />
      </MenuItem>
      <MenuItem onClick={() => signOut()}>
        <Typography variant="body2" color="text.primary">
          {m.components_layout_userMenu_signOut()}
        </Typography>
      </MenuItem>
    </Menu>
  );
}

const listItemStyles = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 1,
  padding: '12px 16px',
  marginBottom: 1,
  color: 'common.white',
};
