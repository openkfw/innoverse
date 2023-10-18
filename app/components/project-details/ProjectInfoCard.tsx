import { Divider } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Project } from '@/common/types';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

import CollaborationColumn from './CollaborationColumn';
import ProjectStageCard from './ProjectStageCard';
import TeamMembersColumn from './TeamMembersColumn';
import UpdateCard from './UpdateCard';

interface ProjectInfoProps {
  project: Project;
  setActiveTab: (tab: number) => void;
}

const MAX_UPDATES = 1;

export const ProjectInfoCard = (props: ProjectInfoProps) => {
  const { project, setActiveTab } = props;

  return (
    <Card sx={cardStyles}>
      <CardContent sx={cardContentStyles}>
        <Grid container spacing={2} sx={containerStyles}>
          {/* First Column - Project Info */}
          <Grid item xs={4}>
            <Grid container direction="column" spacing={1}>
              <Grid item xs={4}>
                <ProjectStageCard projectStart={project.projectStart} projectEnd={project.projectEnd} />
              </Grid>
              <Grid item xs={4} sx={interactionStyles}>
                <InteractionButton projectName={project.projectName} interactionType={InteractionType.LIKE} />
                <InteractionButton projectName={project.projectName} interactionType={InteractionType.PROJECT_FOLLOW} />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  153 Likes - 43 Innovaders folgen
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Second Column - Collaboration and Updates */}
          <Grid item xs={8}>
            <Grid container spacing={2} sx={collaborationWrapperStyles}>
              <Grid item xs={9}>
                <CollaborationColumn
                  projectName={project.title}
                  collaboration={project.collaboration}
                  setActiveTab={setActiveTab}
                />
              </Grid>
              <Grid item xs={3}>
                <TeamMembersColumn team={project.team} projectName={project.title} />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={dividerStyles} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="overline" sx={latestUpdatesStyles}>
                  Neuesten updates ({Math.min(project.updates.length, MAX_UPDATES)} von {project.updates.length})
                </Typography>
              </Grid>
              <Grid item container xs={12} spacing={2}>
                {project.updates.slice(0, MAX_UPDATES).map((update, key) => (
                  <Grid key={key} item xs={4}>
                    <UpdateCard update={update} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Project Info Card Styles

const cardStyles = {
  borderRadius: '24px',
  width: '1280px',
  boxShadow:
    '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
};

const cardContentStyles = {
  margin: '56px 64px',
};

const containerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
};

const interactionStyles = {
  marginTop: 2,
};

const dividerStyles = {
  height: '1px',
  marginTop: '20px',
  marginBottom: '20px',
  background: 'rgba(0, 90, 140, 0.20)',
};

const latestUpdatesStyles = {
  textAlign: 'center',
  color: 'primary.light',
  marginBottom: '25px',
};

const collaborationWrapperStyles = {
  marginLeft: '10px',
};
