import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';
import { openWebex } from '@/utils/openWebex';

import InteractionButton, { InteractionType } from './InteractionButton';

interface UserTooltipProps {
  user: User;
  projectName?: string;
}

export const UserTooltip = (props: UserTooltipProps) => {
  const { user, projectName } = props;
  return (
    <Grid container sx={{ m: 3, display: 'flex', justifyContent: 'space-between', gap: 3, width: 'fit-content' }}>
      <Grid item container sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
        <Typography variant="subtitle1" sx={{ color: 'text.primary', lineHeight: 1 }}>
          {user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user.role}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user.email}
        </Typography>
      </Grid>
      <Grid item>
        <InteractionButton
          projectName={projectName}
          interactionType={InteractionType.COMMENT}
          tooltip="Chat über Webex"
          onClick={() => openWebex(user.email)}
          sx={{ marginLeft: 1 }}
        />
      </Grid>
    </Grid>
  );
};
