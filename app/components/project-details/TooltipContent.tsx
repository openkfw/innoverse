import { Grid, Typography } from '@mui/material';

import InteractionButton from '../common/InteractionButton';
interface TeamMemberProps {
  teamMember: { name: string; avatar: string; role: string };
}
export const TooltipContent = (props: TeamMemberProps) => {
  const { teamMember } = props;
  return (
    <Grid container sx={{ m: '10px' }}>
      <Grid item xs={5}>
        <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
          {teamMember.name}
        </Typography>
        <Typography variant="caption" sx={{ color: '#507666;' }}>
          {teamMember.role}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <InteractionButton interactionType="user-follow" />
      </Grid>
      <Grid item xs={3}>
        <InteractionButton interactionType="comment" />
      </Grid>
    </Grid>
  );
};
