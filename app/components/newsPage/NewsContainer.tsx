'use client';

import React, { useState } from 'react';

import FilterIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import { NewsFilterContextProvider, useNewsFilter } from '@/app/contexts/news-filter-context';
import theme from '@/styles/theme';

import CustomToast from '../common/CustomToast';
import InteractionButton, { interactionButtonStyles, InteractionType } from '../common/InteractionButton';
import SecondaryIconButton from '../common/SecondaryIconButton';

import AddUpdateDialog from './addUpdate/AddUpdateDialog';
import MobileNewsFilter from './newsFilter/MobileNewsFilter';
import NewsFilter from './newsFilter/NewsFilter';
import { News, SortValues } from './News';

interface NewsContainerProps {
  handleAddUpdate: () => void;
  updateAdded: boolean;
}

function NewsContainerMobile(props: NewsContainerProps) {
  const { handleAddUpdate, updateAdded } = props;
  const { sort, sortNews } = useNewsFilter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <InteractionButton
        onClick={handleAddUpdate}
        interactionType={InteractionType.ADD_UPDATE}
        sx={interactionButtonStyles}
      />
      <MobileNewsFilter open={drawerOpen} setOpen={setDrawerOpen} />
      <Grid item container xs={12} sx={{ mt: 3 }}>
        <Grid container justifyContent="space-between" mb={1}>
          <SecondaryIconButton
            label="Filters"
            icon={<FilterIcon sx={{ color: 'secondary.main' }} />}
            onClick={() => setDrawerOpen(true)}
          />
          <SecondaryIconButton
            label={sort === SortValues.DESC ? 'Neueste zuerst' : 'Älteste zuerst'}
            icon={<FilterListIcon sx={{ color: 'secondary.main' }} />}
            onClick={sortNews}
          />
        </Grid>
        <News updateAdded={updateAdded} />
      </Grid>
    </>
  );
}

function NewsContainerReg(props: NewsContainerProps) {
  const { handleAddUpdate, updateAdded } = props;
  const { sort, sortNews } = useNewsFilter();

  return (
    <Grid container>
      <Grid container item xs={12}>
        <InteractionButton
          onClick={handleAddUpdate}
          interactionType={InteractionType.ADD_UPDATE}
          sx={interactionButtonStyles}
        />
      </Grid>
      <Grid item xs={4} sm={4} md={4} lg={3}>
        <NewsFilter />
      </Grid>
      <Grid item xs={8} sm={8} md={8} lg={9} mt={-1}>
        <Box mb={1} display="flex" justifyContent="flex-end">
          <SecondaryIconButton
            label={sort === SortValues.DESC ? 'Neueste zuerst' : 'Älteste zuerst'}
            icon={<FilterListIcon sx={{ color: 'secondary.main' }} />}
            onClick={sortNews}
          />
        </Box>
        <News updateAdded={updateAdded} />
      </Grid>
    </Grid>
  );
}

export default function NewsContainer() {
  const [addUpdateDialogOpen, setAddUpdateDialogOpen] = useState(false);
  const [updateAdded, setUpdateAdded] = useState<boolean>(false);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleAddUpdate = () => {
    setAddUpdateDialogOpen(true);
  };

  return (
    <NewsFilterContextProvider>
      <Grid container item sx={{ mt: 4 }} xs={12}>
        {isSmallScreen ? (
          <NewsContainerMobile handleAddUpdate={handleAddUpdate} updateAdded={updateAdded} />
        ) : (
          <NewsContainerReg handleAddUpdate={handleAddUpdate} updateAdded={updateAdded} />
        )}
      </Grid>
      <AddUpdateDialog open={addUpdateDialogOpen} setOpen={setAddUpdateDialogOpen} setUpdateAdded={setUpdateAdded} />
      <CustomToast />
    </NewsFilterContextProvider>
  );
}
