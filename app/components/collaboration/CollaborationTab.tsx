import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { project_colaboration } from '@/repository/mock/project/project-page';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

import { SurveyCard } from './SurveyCard';
import { UpdateCard } from './UpdateCard';

export const CollaborationTab = () => {
  const { projectUpdates, surveyQuestions } = project_colaboration;
  return (
    <Card sx={containerStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent>
        <Grid container spacing={8} sx={gridStyles}>
          <Grid item xs={6} sx={{ paddingRight: '100px' }}>
            <Typography variant="h5" color="secondary.contrastText" sx={{ mb: '10px' }}>
              Wir suchen Deine Unterstützung beim Thema Midjourney.
            </Typography>
            <Typography variant="body1" color="secondary.contrastText">
              Du kennst Dich mit Midjourney und Co. aus? Dann brauchen wir Dich für einen Workshop mit den
              Geschäftsbereichen, um das Thema verständlich zu präsentieren und Anwendungsfälle zu brainstormen.
            </Typography>
            <Typography variant="overline" color="primary.main">
              Aufwand: ca. 1 Tag
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={joinTeamStyles}>
              <InteractionButton interactionType={InteractionType.APPLY} />
              <InteractionButton interactionType={InteractionType.RECOMMEND} />
            </Box>
          </Grid>
        </Grid>

        <Divider textAlign="left" sx={{ m: 4 }}>
          <Chip label="Hilf uns bei diesen Fragen" />
        </Divider>

        <Grid container sx={gridStyles} spacing={8}>
          {surveyQuestions.map((question, i) => (
            <Grid item key={i}>
              <SurveyCard surveyQuestion={question} />
            </Grid>
          ))}
        </Grid>

        <Grid container sx={gridStyles} spacing={8}>
          {projectUpdates.map((update, i) => (
            <Grid item key={i}>
              <UpdateCard content={update} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Collaboration Tab Styles

const containerStyles = {
  borderRadius: '24px',
  background: '#FFF',
  position: 'relative',
  zIndex: 0,
  boxShadow:
    '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
};

const colorOverlayStyles = {
  width: '50%',
  height: '100%',
  borderRadius: 'var(--2, 16px) 0px 0px var(--2, 16px)',
  opacity: 0.6,
  background: 'linear-gradient(90deg, rgba(240, 238, 225, 0.00) 10.42%, #F0EEE1 100%)',
  position: 'absolute',
  zIndex: -1,
};

const joinTeamStyles = {
  marginLeft: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: 1,
};

const gridStyles = {
  padding: '88px 64px ',
};
