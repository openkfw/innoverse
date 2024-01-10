'use client';

import { Grid, Typography } from '@mui/material';

import { useProject } from '@/app/contexts/project-context';
import { Project } from '@/common/types';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

interface CollaborationProps {
  setActiveTab: (tab: number) => void;
  project: Project;
}

const CollaborationColumn = (props: CollaborationProps) => {
  const { setActiveTab, project } = props;
  const { projectName } = project;
  const { surveyVotesAmount, collaborationCommentsAmount } = useProject();

  const description = `Dein Feedback ist uns sehr wichtig. Bitte teile uns deine Gedanken, Anregungen und Ideen mit. Gemeinsam können wir großartige Veränderungen bewirken`;

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
            {description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {`${collaborationCommentsAmount} Beteilungen - ${surveyVotesAmount} Votes`}
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ mt: '15px' }}>
          <InteractionButton
            projectName={projectName}
            interactionType={InteractionType.COLLABORATION}
            onClick={() => handleCollaborationClick(-325)}
            sx={{ background: 'secondary.main', color: 'rgba(255, 255, 255, 1)' }}
          />
          <InteractionButton
            projectName={projectName}
            interactionType={InteractionType.COLLABORATION}
            onClick={() => handleCollaborationClick(75)}
            label="Komm ins Team!"
            sx={{ background: 'secondary.main', color: 'rgba(255, 255, 255, 1)' }}
          />
          <InteractionButton
            interactionType={InteractionType.COLLABORATION}
            projectName={projectName}
            label="Umfrage machen!"
            sx={{ background: 'secondary.main', color: 'rgba(255, 255, 255, 1)' }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CollaborationColumn;
