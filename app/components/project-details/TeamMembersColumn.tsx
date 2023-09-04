import { Avatar, AvatarGroup, Typography } from '@mui/material';

import { StyledToolip } from '../common/StyledTooltip';

import { TooltipContent } from './TooltipContent';

interface TeamMembersProps {
  teamMembers: { name: string; avatar: string; role: string }[];
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

const toolipStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  '& .mui-1sucosy-MuiTooltip-tooltip': {
    backgroundColor: 'white',
  },
};

const TeamMembersColumn = (props: TeamMembersProps) => {
  const { teamMembers } = props;
  return (
    <>
      <Typography variant="overline" sx={{ textAlign: 'left', color: 'primary.light', mb: '25px' }}>
        Team Members
      </Typography>
      <AvatarGroup max={4} sx={avatarGroupStyle}>
        {teamMembers.map((t) => (
          <StyledToolip
            arrow
            sx={toolipStyle}
            key={t.name}
            title={<TooltipContent teamMember={t} />}
            placement="bottom"
          >
            <Avatar style={{ border: '2px solid white' }} key={t.name} alt={t.name} src={t.avatar} />
          </StyledToolip>
        ))}
      </AvatarGroup>
    </>
  );
};

export default TeamMembersColumn;
