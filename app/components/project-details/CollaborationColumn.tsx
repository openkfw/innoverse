import { Grid, Typography } from '@mui/material';

import { ProjectCollaboration } from '@/common/types';

import InteractionButton from '../common/InteractionButton';

interface CollaborationProps {
  collaborationData: ProjectCollaboration;
  setActiveTab: (tab: number) => void;
}

const CollaborationColumn = (props: CollaborationProps) => {
  const { collaborationData, setActiveTab } = props;

  const handleCollaborationClick = async () => {
    const scroll = () => {
      const section = document.getElementById('collaboration-tab')?.offsetTop;

      if (section) {
        window.scrollTo({
          top: section - 150,
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
          <Typography variant="overline" sx={{ color: 'primary.light', mb: '25px' }}>
            Zusammenarbeit
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.87)', mb: '25px' }}>
            {collaborationData.description}
          </Typography>
          <Typography variant="caption" sx={{ color: '#507666' }}>
            {collaborationData.participants} Beteilungen - {collaborationData.upvotes} Votes
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <InteractionButton interactionType="collaboration" onClick={handleCollaborationClick} />
          <InteractionButton interactionType="collaboration" label="Take our Survey" />
          <InteractionButton interactionType="collaboration" label="Support Us" />
        </Grid>
      </Grid>
    </>
  );
};

export default CollaborationColumn;
