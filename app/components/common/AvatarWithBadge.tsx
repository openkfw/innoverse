import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

import { useUser } from '@/app/contexts/user-context';

import AvatarIcon from './AvatarIcon';

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
        <AvatarIcon user={user} size={32} />
      </StyledBadge>
    )
  );
};

export default AvatarWithBadge;
