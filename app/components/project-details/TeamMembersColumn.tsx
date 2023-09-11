import { AvatarGroup, Typography } from '@mui/material';

import { Person } from '@/common/types';

import AvatarIcon from '../common/AvatarIcon';
import { StyledTooltip } from '../common/StyledTooltip';

import { TooltipContent } from './TooltipContent';

interface TeamMembersProps {
  teamMembers: Person[];
}

const avatarGroupStyle = {
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'flex-end',
  border: '2px solid white',
  color: 'rgba(0, 0, 0, 0.10)',
  '& .MuiAvatar-colorDefault': {
    border: '2px solid white',
    background: 'linear-gradient(84deg, #85898b 0%, #ffffff 100%)',
    color: 'rgba(0, 0, 0, 0.56)',
  },
};

const TeamMembersColumn = (props: TeamMembersProps) => {
  const { teamMembers } = props;
  return (
    <>
      <Typography variant="overline" sx={{ textAlign: 'left', color: 'primary.light', mb: '25px' }}>
        Unser Team
      </Typography>
      <AvatarGroup max={4} sx={avatarGroupStyle}>
        {teamMembers.map((t, index) => (
          <StyledTooltip arrow key={index} title={<TooltipContent teamMember={t} />} placement="bottom">
            <AvatarIcon src={t.avatar} key={t.name} />
          </StyledTooltip>
        ))}
      </AvatarGroup>
    </>
  );
};

export default TeamMembersColumn;
