import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

import { useUser } from '@/app/contexts/user-context';
import * as m from '@/src/paraglide/messages.js';

import AvatarInitialsIcon from './AvatarInitialsIcon';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const AvatarWithBadge = () => {
  const { user } = useUser();

  return (
    user && (
      <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} variant="dot">
        {user.image ? (
          <Avatar sx={{ width: 32, height: 32 }} src={user.image} alt={m.components_layout_loggedInMenu_imageAlt()} />
        ) : (
          <AvatarInitialsIcon name={user.name} size={32} />
        )}
      </StyledBadge>
    )
  );
};

export default AvatarWithBadge;
