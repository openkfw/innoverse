import React from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ExportFeedback from '@/components/export/ExportFeedback';
import * as m from '@/src/paraglide/messages.js';

const ExportFeedbackPage = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: '100vh',
      }}
    >
      <Grid item xs={3}>
        <Stack spacing={3}>
          <Typography variant="h4">{m.app_export_page_export()}</Typography>
          <ExportFeedback />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ExportFeedbackPage;
