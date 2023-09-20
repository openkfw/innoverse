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
    <Grid container spacing={5}>
      <Grid container item xs={6} direction="column" spacing={2} sx={{ paddingRight: '100px' }}>
        <Grid item>
          <Typography variant="h5" color="secondary.contrastText">
            {question}
          </Typography>
        </Grid>
      </Grid>

      <Grid container item xs={6} spacing={2}>
        <Box sx={{ marginLeft: '-20px' }}>
          <Typography variant="body1" color="secondary.contrastText">
            {responseOptions}
          </Typography>
          <Typography variant="body1" color="secondary.contrastText">
            {votes}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
