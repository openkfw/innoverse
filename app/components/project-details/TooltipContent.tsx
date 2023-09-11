import { Grid, Typography } from '@mui/material';

import { Person } from '@/common/types';

import InteractionButton, { InteractionType } from '../common/InteractionButton';
interface TeamMemberProps {
  teamMember: Person;
}
export const TooltipContent = (props: TeamMemberProps) => {
  const { teamMember } = props;
  return (
    <Grid container sx={{ m: 1 }}>
      <Grid item container xs={5}>
        <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
          {teamMember.name}
        </Typography>
        <Typography variant="caption" color="text.primary">
          {teamMember.role}
        </Typography>
      </Grid>
      <Grid item container xs={7}>
        <Grid item xs={7}>
          <InteractionButton interactionType={InteractionType.USER_FOLLOW} />
        </Grid>
        <Grid item xs={5}>
          <InteractionButton interactionType={InteractionType.COMMENT} />
        </Grid>
      </Grid>
    </Grid>
  );
};
