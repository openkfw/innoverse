import { Grid, Typography } from '@mui/material';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

interface CollaborationProps {
  collaborationData: string;
  setActiveTab: (tab: number) => void;
}

const CollaborationColumn = (props: CollaborationProps) => {
  const { collaborationData, setActiveTab } = props;

  const handleCollaborationClick = async (offset: number) => {
    const scroll = () => {
      const section = document.getElementById('collaboration-tab')?.offsetTop;

      if (section) {
        window.scrollTo({
          top: section - offset,
          behavior: 'smooth',
        });
      }
    };
    await setActiveTab(1);
    scroll();
  };

  return (
    <>
      <Grid container direction="column">
        <Grid item xs={4}>
          <Typography variant="overline" sx={{ color: 'primary.light' }}>
            Zusammenarbeit
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.87)', mb: '15px', marginTop: 1 }}>
            {collaborationData}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            26531 Beteilungen - 91283 Votes
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ mt: '15px' }}>
          <InteractionButton
            interactionType={InteractionType.COLLABORATION}
            onClick={() => handleCollaborationClick(-325)}
            sx={{ background: 'secondary.main', color: 'rgba(255, 255, 255, 1)' }}
          />
          <InteractionButton
            interactionType={InteractionType.COLLABORATION}
            onClick={() => handleCollaborationClick(75)}
            label="Komm ins Team!"
            sx={{ background: 'secondary.main', color: 'rgba(255, 255, 255, 1)' }}
          />
          <InteractionButton
            interactionType={InteractionType.COLLABORATION}
            label="Umfrage machen!"
            sx={{ background: 'secondary.main', color: 'rgba(255, 255, 255, 1)' }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CollaborationColumn;
