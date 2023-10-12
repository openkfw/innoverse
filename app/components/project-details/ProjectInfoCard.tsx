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

export const ProjectInfoCard = (props: ProjectInfoProps) => {
  const { project, setActiveTab } = props;

  return (
    <Card sx={{ borderRadius: '24px', width: '1280px' }}>
      <CardContent sx={{ margin: '56px 64px' }}>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* First Column - Project Info */}
          <Grid item xs={4}>
            <Grid container direction="column" spacing={1}>
              <Grid item xs={4}>
                <ProjectStageCard projectStart={project.projectStart} projectEnd={project.projectEnd} />
              </Grid>
              <Grid item xs={4} sx={{ mt: 2 }}>
                <InteractionButton interactionType={InteractionType.LIKE} />
                <InteractionButton interactionType={InteractionType.PROJECT_FOLLOW} />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  {project.likes} Likes - {project.followers} Innovaders folgen
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Second Column - Collaboration and Updates */}
          <Grid item xs={8}>
            <Grid container spacing={2} sx={{ ml: '10px' }}>
              <Grid item xs={9}>
                <CollaborationColumn collaborationData={project.collaboration} setActiveTab={setActiveTab} />
              </Grid>
              <Grid item xs={3}>
                <TeamMembersColumn team={project.team} />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ height: '1px', mt: '20px', mb: '20px', background: 'rgba(0, 90, 140, 0.20)' }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="overline" sx={{ textAlign: 'center', color: 'primary.light', mb: '25px' }}>
                  Neuesten updates (3 von 12)
                </Typography>
              </Grid>
              <Grid item container xs={12} spacing={2}>
                {project.updates.map((update, key) => (
                  <Grid key={key} item xs={4}>
                    <UpdateCard update={update} />
                  </Grid>
                ))}
                ;
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
