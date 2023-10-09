import { Divider } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ProjectSummary } from '@/common/types';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

import CollaborationColumn from './CollaborationColumn';
import ProjectStageCard from './ProjectStageCard';
import TeamMembersColumn from './TeamMembersColumn';
import UpdateCard from './UpdateCard';

interface ProjectInfoProps {
  projectSummary: ProjectSummary;
  setActiveTab: (tab: number) => void;
}

export const ProjectInfoCard = (props: ProjectInfoProps) => {
  const { projectSummary, setActiveTab } = props;

  return (
    <Card sx={cardStyles}>
      <CardContent sx={cardContentStyles}>
        <Grid container spacing={2} sx={containerStyles}>
          {/* First Column - Project Info */}
          <Grid item xs={4}>
            <Grid container direction="column" spacing={1}>
              <Grid item xs={4}>
                <ProjectStageCard timingData={projectSummary.timing} />
              </Grid>
              <Grid item xs={4} sx={interactionStyles}>
                <InteractionButton projectName={projectSummary.projectName} interactionType={InteractionType.LIKE} />
                <InteractionButton
                  projectName={projectSummary.projectName}
                  interactionType={InteractionType.PROJECT_FOLLOW}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  {projectSummary.likes} Likes - {projectSummary.followers} Innovaders folgen
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Second Column - Collaboration and Updates */}
          <Grid item xs={8}>
            <Grid container spacing={2} sx={collaborationWrapperStyles}>
              <Grid item xs={9}>
                <CollaborationColumn
                  projectName={projectSummary.projectName}
                  collaborationData={projectSummary.collaboration}
                  setActiveTab={setActiveTab}
                />
              </Grid>
              <Grid item xs={3}>
                <TeamMembersColumn projectName={projectSummary.projectName} teamMembers={projectSummary.teamMembers} />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={dividerStyles} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="overline" sx={latestUpdatesStyles}>
                  Neuesten updates (3 von 12)
                </Typography>
              </Grid>
              <Grid item container xs={12} spacing={2}>
                <Grid item xs={4}>
                  <UpdateCard update={projectSummary.updates[0]} />
                </Grid>
                <Grid item xs={4}>
                  <UpdateCard update={projectSummary.updates[1]} />
                </Grid>
                <Grid item xs={4}>
                  <UpdateCard update={projectSummary.updates[2]} />
                </Grid>
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
