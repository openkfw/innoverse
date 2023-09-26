import { Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { SurveyQuestion } from '@/common/types';

interface SurveyCardProps {
  surveyQuestion: SurveyQuestion;
}

export const SurveyCard = ({ surveyQuestion }: SurveyCardProps) => {
  const { question, responseOptions, votes } = surveyQuestion;

  return (
    <Grid container spacing={5} xs={12}>
      <Grid
        container
        item
        xs={6}
        direction="column"
        spacing={2}
        sx={{ paddingRight: '100px', alignSelf: 'flex-start' }}
      >
        <Grid item>
          <Typography variant="h5" color="secondary.contrastText">
            {question}
          </Typography>
        </Grid>
      </Grid>

      <Grid container direction="row" item xs={6} spacing={2} sx={{ justifyContent: 'space-evenly' }}>
        <Grid item sx={{ ml: '4px' }}>
          {responseOptions.map((response) => {
            return (
              <Chip
                label={response}
                key={response}
                sx={{
                  display: 'flex',
                  mb: '10px',
                  width: '320px',
                  height: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  borderRadius: '100px',
                  fontSize: '13px',
                  background: 'rgba(0, 0, 0, 0.08)',
                }}
              />
            );
          })}
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: '172px',
              height: '120px',
              display: 'flex',
              padding: 'var(--2, 16px)',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 'var(--1, 8px)',
              flexShrink: 0,
              borderRadius: 'var(--1, 8px)',
              background: 'rgba(0, 90, 140, 0.10)',
            }}
          >
            <Typography variant="subtitle1" color="primary.main">
              {votes} Votes
            </Typography>
            <Typography variant="caption" color="primary.main">
              Um die Ergebnisse zu sehen, bitte gib deine Stimme ab.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};
