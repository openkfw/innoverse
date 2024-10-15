'use client';

import { PropsWithChildren } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';

export default function ProjectsPageContainer({ children }: PropsWithChildren) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={3}>
        <Card sx={cardStyles}>
          <Typography variant="h2" sx={cardTitleStyles}>
            {m.components_projectpage_projectPageContainer_projects()}
          </Typography>
          <Typography variant="subtitle1" sx={cardSubtitleStyles}>
            {m.components_projectpage_projectPageContainer_projectText()}
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        {children}
      </Grid>
    </Grid>
  );
}

const cardStyles = {
  px: 3,
  py: 4,
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  backgroundColor: 'rgba(255, 255, 255, 0.10)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
};

const cardTitleStyles = {
  fontSize: '40px',
};

const cardSubtitleStyles = {
  mt: 1,
  fontSize: 16,
};
