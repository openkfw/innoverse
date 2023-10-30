import { Grid, Typography } from '@mui/material';

import { Person } from '@/common/types';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

interface TeamMemberProps {
  teamMember: Person;
  projectName: string;
}

export const TooltipContent = (props: TeamMemberProps) => {
  const { teamMember, projectName } = props;
  return (
    <Grid container sx={{ m: 3, display: 'flex', justifyContent: 'space-between', gap: 3, width: 'fit-content' }}>
      <Grid item container sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
        <Typography variant="subtitle1" sx={{ color: 'text.primary', lineHeight: 1 }}>
          {teamMember.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {teamMember.role}
        </Typography>
      </Grid>
      <Grid item>
        <InteractionButton projectName={projectName} interactionType={InteractionType.USER_FOLLOW} />
        <InteractionButton projectName={projectName} interactionType={InteractionType.COMMENT} />
      </Grid>
    </Grid>
  );
};
