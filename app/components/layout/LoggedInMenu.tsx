'use client';

import { useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

import { UserSession } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import AvatarInitialsIcon from '../common/AvatarInitialsIcon';

import UserMenu from './UserMenu';

interface LoggedInMenuProps {
  user: UserSession | undefined;
  isUserLoading: boolean;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

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

  if (isUserLoading) {
    return (
      <IconButton>
        <CircularProgress size={32} color="secondary" aria-label="loading" />
      </IconButton>
    );
  }
  return (
    <>
      {user && (
        <div data-testid="user-menu">
          <IconButton sx={menuItemStyle} onClick={handleOpenUserMenu}>
            <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} variant="dot">
              {user.image ? (
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src={user.image}
                  alt={m.components_layout_loggedInMenu_imageAlt()}
                />
              ) : (
                <AvatarInitialsIcon name={user.name} size={32} />
              )}
            </StyledBadge>
          </IconButton>
          <UserMenu user={user} anchorElUser={anchorElUser} setAnchorElUser={setAnchorElUser} />
        </div>
      )}
    </>
  );
}
