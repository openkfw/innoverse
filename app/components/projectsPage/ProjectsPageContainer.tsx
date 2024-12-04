'use client';

import { PropsWithChildren, useState } from 'react';

import FilterIcon from '@mui/icons-material/FilterAlt';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';

import { mergeStyles } from '../../utils/helpers';
import SecondaryIconButton from '../common/SecondaryIconButton';

import MobileProjectFilter from './MobileProjectFilter';
import ProjectFilter from './ProjectFilter';

export default function ProjectsPageContainer({ children }: PropsWithChildren) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8} lg={9}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
            <Card sx={mergeStyles(cardStyles, titleCardStyles)}>
              <Typography variant="h2" sx={cardTitleStyles}>
                {m.components_projectpage_projectPageContainer_projects()}
              </Typography>
              <Typography variant="subtitle1" sx={cardSubtitleStyles}>
                {m.components_projectpage_projectPageContainer_projectText()}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box sx={mergeStyles(cardStyles, stickyContainer)}>
              <Box sx={{ display: { xs: 'block', md: 'none' }, justifyContent: 'flex-end' }}>
                <Grid item>
                  <SecondaryIconButton
                    label={m.components_newsFeed_newsFeedContainer_filter()}
                    icon={<FilterIcon sx={{ color: 'secondary.main' }} />}
                    onClick={() => setDrawerOpen(true)}
                  />
                </Grid>
                <MobileProjectFilter open={drawerOpen} setOpen={setDrawerOpen} />
              </Box>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <ProjectFilter />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  );
}

const titleCardStyles = {
  px: 3,
  py: 4,
};

const cardStyles = {
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
const stickyContainer = {
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky',
  top: 50,
  overflowY: 'auto',
  maxWidth: 'fit-content',
  px: '10px',
  height: '100%',
};
