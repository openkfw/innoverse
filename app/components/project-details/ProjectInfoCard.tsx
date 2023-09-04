import { Divider } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import InteractionButton from '../common/InteractionButton';

import CollaborationColumn from './CollaborationColumn';
import ProjectStageCard from './ProjectStageCard';
import TeamMembersColumn from './TeamMembersColumn';
import UpdateCard from './UpdateCard';

const dummyProjectInfo = {
  timing: {
    projectStart: 'Okt 2022',
    projectEnd: 'Nov 2023',
  },
  collaboration: {
    description:
      'Dein Feedback ist uns sehr wichtig. Bitte teile uns deine Gedanken, Anregungen und Ideen mit. Gemeinsam können wir großartige Veränderungen bewirken.',
    participants: 14,
    votes: 54,
  },
  likes: 153,
  followers: 43,
  teamMembers: [
    {
      name: 'Anna Schwarz',
      avatar: '/images/avatar2.png',
      role: 'Junior Consultant',
    },
    {
      name: 'Tony Hawk',
      avatar: '/images/avatar.png',
      role: 'Junior Consultant',
    },
    {
      name: 'Anna Schwarz',
      avatar: '/images/avatar2.png',
      role: 'Junior Consultant',
    },
    {
      name: 'Tony Hawk',
      avatar: '/images/avatar.png',
      role: 'Junior Consultant',
    },
    {
      name: 'Anna Schwarz',
      avatar: '/images/avatar.png',
      role: 'Junior Consultant',
    },
  ],
  updates: [
    {
      author: {
        name: 'Anna Schwarz',
        avatar: '/images/avatar2.png',
      },
      content:
        'Bleib gespannt auf bevorstehende Ankündigungen und Überraschungen. Wir können es kaum erwarten, zu teilen, was auf dich wartet. Sei bereit für etwas 🚀',
      date: '12. Aug 2023',
    },
    {
      author: {
        name: 'Tony Hawk',
        avatar: '/images/avatar.png',
      },
      content:
        'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
      date: '4. Jul 2023',
    },
    {
      author: {
        name: 'Tony Hawk',
        avatar: '/images/avatar.png',
      },
      content:
        'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
      date: '4. Jul 2023',
    },
  ],
};

export const ProjectInfoCard = () => {
  return (
    <Card
      sx={{
        borderRadius: '24px',
        width: '1280px',
        height: '563px',
      }}
    >
      <CardContent sx={{ ml: '25px', mr: '25px' }}>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* First Column - Project Info */}
          <Grid item xs={4}>
            <Grid container direction="column" spacing={1}>
              <Grid item xs={4}>
                <ProjectStageCard timingData={dummyProjectInfo.timing} />
              </Grid>
              <Grid item xs={4}>
                <InteractionButton interactionType="like" sx={{ mt: '30px' }} />
                <InteractionButton interactionType="project-follow" />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ color: '#507666' }}>
                  {dummyProjectInfo.likes} Likes - {dummyProjectInfo.followers} Members folgen
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Second Column - Collaboration and Updates */}
          <Grid item xs={8}>
            <Grid container spacing={2} sx={{ ml: '10px' }}>
              <Grid item xs={9}>
                <CollaborationColumn collaborationData={dummyProjectInfo.collaboration} />
              </Grid>
              <Grid item xs={3}>
                <TeamMembersColumn teamMembers={dummyProjectInfo.teamMembers} />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ height: '1px', mt: '20px', mb: '20px', background: 'rgba(0, 90, 140, 0.20)' }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="overline" sx={{ textAlign: 'center', color: 'primary.light', mb: '25px' }}>
                  Neusten Updates (3 von 12)
                </Typography>
              </Grid>
              <Grid item container xs={12} spacing={2}>
                <Grid item xs={4}>
                  <UpdateCard update={dummyProjectInfo.updates[0]} />
                </Grid>
                <Grid item xs={4}>
                  <UpdateCard update={dummyProjectInfo.updates[2]} />
                </Grid>
                <Grid item xs={4}>
                  <UpdateCard update={dummyProjectInfo.updates[2]} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
