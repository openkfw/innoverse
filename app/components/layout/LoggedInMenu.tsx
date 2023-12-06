'use client';

import { useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

import { UserSession } from '@/common/types';
import theme from '@/styles/theme';

import UserMenu from './UserMenu';

interface LoggedInMenuProps {
  user: UserSession;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

export default function LoggedInMenu({ user }: LoggedInMenuProps) {
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
      <IconButton sx={menuItemStyle} onClick={handleOpenUserMenu}>
        <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} variant="dot">
          {user.image ? (
            <Avatar sx={{ width: 32, height: 32 }} src={user.image} alt="avatar" />
          ) : (
            <Avatar sx={{ width: 32, height: 32 }}>
              <AccountCircleIcon fontSize="large" sx={{ fill: 'black' }} />
            </Avatar>
          )}
        </StyledBadge>
      </IconButton>
      <UserMenu user={user} anchorElUser={anchorElUser} setAnchorElUser={setAnchorElUser} />
    </>
  );
}
