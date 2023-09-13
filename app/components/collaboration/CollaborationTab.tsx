import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { project_colaboration } from '@/repository/mock/project/project-page';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

import { UpdateCard } from './UpdateCard';

export const CollaborationTab = () => {
  const { projectUpdates } = project_colaboration;
  return (
    <Card
      sx={{
        borderRadius: '24px',
        background: '#FFF',
        position: 'relative',
        zIndex: 0,
        boxShadow:
          '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
      }}
    >
      <Box
        sx={{
          width: 575,
          height: '100%',
          borderRadius: 'var(--2, 16px) 0px 0px var(--2, 16px)',
          opacity: 0.6,
          background: 'linear-gradient(90deg, rgba(240, 238, 225, 0.00) 10.42%, #F0EEE1 100%)',
          position: 'absolute',
          zIndex: -1,
        }}
      ></Box>

      <CardContent>
        <Grid container spacing={8} sx={{ p: 4 }}>
          <Grid item xs={6}>
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
            <Box
              sx={{
                marginLeft: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <InteractionButton interactionType={InteractionType.APPLY} />
              <InteractionButton interactionType={InteractionType.RECOMMEND} />
            </Box>
          </Grid>
        </Grid>
        <Divider textAlign="left" sx={{ m: 4 }}>
          <Chip label="Hilf uns bei diesen Fragen" />
        </Divider>

        <Grid container sx={{ p: 4 }} spacing={8}>
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
