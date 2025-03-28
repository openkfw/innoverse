'use client';

import { useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';

import { UserSession } from '@/common/types';
import theme from '@/styles/theme';

import AvatarWithBadge from '../common/AvatarWithBadge';

import UserMenu from './UserMenu';

interface LoggedInMenuProps {
  user?: UserSession;
  isUserLoading: boolean;
}

export default function LoggedInMenu({ user, isUserLoading }: LoggedInMenuProps) {
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
    <>
      {isUserLoading && (
        <IconButton>
          <CircularProgress size={32} color="secondary" aria-label="loading" />
        </IconButton>
      )}
      {user && (
        <div data-testid="user-menu">
          <IconButton sx={menuItemStyle} onClick={handleOpenUserMenu}>
            <AvatarWithBadge />
          </IconButton>
          <UserMenu user={user} anchorElUser={anchorElUser} setAnchorElUser={setAnchorElUser} />
        </div>
      )}
    </>
  );
}
