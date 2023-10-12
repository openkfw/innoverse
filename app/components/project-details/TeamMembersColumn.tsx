import { useState } from 'react';

import { AvatarGroup, Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { Person } from '@/common/types';

import AvatarIcon from '../common/AvatarIcon';
import CustomDialog from '../common/CustomDialog';
import InteractionButton, { InteractionType } from '../common/InteractionButton';
import { StyledTooltip } from '../common/StyledTooltip';

import { TooltipContent } from './TooltipContent';

interface TeamMembersProps {
  team: Person[];
}

const maxAvatars = 3;

const boxStyles = {
  marginLeft: 1,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
};

const avatarGroupStyle = {
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'flex-end',
  border: '2px solid white',
  color: 'rgba(0, 0, 0, 0.10)',
  alignItems: 'center',
  alignContent: 'center',
  '& .MuiAvatar-colorDefault': {
    border: '2px solid white',
    background: 'linear-gradient(84deg, #85898b 0%, #ffffff 100%)',
    color: 'rgba(0, 0, 0, 0.56)',
  },
  '& .MuiAvatarGroup-avatar': {
    cursor: 'pointer',
    zIndex: maxAvatars,
    marginLeft: 1,
  },
};

const TeamMembersColumn = (props: TeamMembersProps) => {
  const { team } = props;

  const [open, setOpen] = useState(false);

  return (
    <>
      <Typography variant="overline" sx={{ textAlign: 'left', color: 'primary.light', mb: '25px' }}>
        Unser Team
      </Typography>
      <AvatarGroup
        max={maxAvatars}
        sx={avatarGroupStyle}
        slotProps={{
          additionalAvatar: { onClick: () => setOpen(true) },
        }}
      >
        {team.map((teamMember, index) => (
          <StyledTooltip arrow key={index} title={<TooltipContent teamMember={teamMember} />} placement="bottom">
            <AvatarIcon src={teamMember.avatar} key={teamMember.name} index={index} allowAnimation={true} />
          </StyledTooltip>
        ))}
      </AvatarGroup>

      <CustomDialog open={open} handleClose={() => setOpen(false)} title="All team members">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {team.map((teamMember, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <AvatarIcon size={48} src={teamMember.avatar} key={teamMember.name} />

              <Box sx={boxStyles}>
                <Typography variant="subtitle1" sx={{ color: 'text.primary', lineHeight: 1 }}>
                  {teamMember.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {teamMember.role}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, display: 'flex', marginLeft: '120px' }}>
                <Grid item>
                  <InteractionButton interactionType={InteractionType.USER_FOLLOW} />
                </Grid>
                <Grid item>
                  <InteractionButton interactionType={InteractionType.COMMENT} />
                </Grid>
              </Box>
            </Box>
          ))}
        </Box>
      </CustomDialog>
    </>
  );
};

export default TeamMembersColumn;
