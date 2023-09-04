import { Grid, Typography } from '@mui/material';

import InteractionButton from '../common/InteractionButton';

interface CollaborationProps {
  collaborationData: {
    description: string;
    participants: number;
    votes: number;
  };
}

const CollaborationColumn = (props: CollaborationProps) => {
  const { collaborationData } = props;
  return (
    <>
      <Grid container direction="column">
        <Grid item xs={4}>
          <Typography variant="overline" sx={{ color: 'primary.light', mb: '25px' }}>
            Zusammenarbeit
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.87)', mb: '25px' }}>
            {collaborationData.description}
          </Typography>
          <Typography variant="caption" sx={{ color: '#507666' }}>
            {collaborationData.participants} Beteilungen - {collaborationData.votes} Votes
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <InteractionButton interactionType="collaboration" />
          <InteractionButton interactionType="collaboration" label="Take our Survey" />
          <InteractionButton interactionType="collaboration" label="Support Us" />
        </Grid>
      </Grid>
    </>
  );
};

export default CollaborationColumn;
