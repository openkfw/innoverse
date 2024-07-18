'use client';

import React, { useCallback, useState } from 'react';
import { isEqual } from 'lodash';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { closeIconButtonStyle } from '@/components/common/CustomDialog';
import { FilterOption } from '@/components/common/FilterSelect';
import CloseIcon from '@/components/icons/CloseIcon';
import theme from '@/styles/theme';

import ApplyFilterButton, { APPLY_BUTTON } from '../newsPage/newsFilter/ApplyFilterButton';

import NewsFeedProjectsFilter from './NewsFeedProjectsFilter';
import NewsFeedSearchFilter from './NewsFeedSearchFilter';
import NewsFeedTypeFilter from './NewsFeedTypeFilter';

interface MobileNewsFeedFilterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MobileNewsFeedFilter(props: MobileNewsFeedFilterProps) {
  const { open, setOpen } = props;
  const { projects, amountOfEntriesByProjectTitle: entriesByProjectTitle, filters, setFilters } = useNewsFeed();
  const [newFilters, setNewFilters] = useState(filters);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const applyFilters = () => {
    setFilters(newFilters);
    setOpen(false);
  };

  const getApplyButtonType = useCallback(() => {
    if (isEqual(filters, newFilters)) {
      return APPLY_BUTTON.DISABLED;
    }
    return APPLY_BUTTON.ENABLED;
  }, [newFilters, filters]);

  const updateFilters = (projectIds: string[]) => {
    const updatedFilters = { ...filters, projectIds };
    setNewFilters(updatedFilters);
  };

  const projectOptions: FilterOption[] | undefined = projects?.map((project) => ({
    name: project.id,
    label: project.title,
    count: entriesByProjectTitle[project.title],
  }));

  return (
    <Box mb={0} sx={{ backgroundColor: theme.palette.background.paper }} date-testid="news-filter">
      <SwipeableDrawer
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'transparent',
            height: 'calc(100% - 200px)',
          },
        }}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box mr="15px" display="flex" justifyContent="flex-end" alignItems="flex-end">
          <IconButton onClick={toggleDrawer(false)} sx={closeIconButtonStyle}>
            <CloseIcon color={theme.palette.text.primary} />
          </IconButton>
        </Box>

        <Box sx={drawerBoxStyle}>
          <Typography variant="overline">Filtern</Typography>
          <Card sx={cardStyles}>
            <NewsFeedSearchFilter isLoading={!projectOptions} filters={filters} setFilters={setFilters} />
            <NewsFeedProjectsFilter isLoading={!projectOptions} onSelect={updateFilters} options={projectOptions} />
            <NewsFeedTypeFilter isLoading={!projectOptions} filters={filters} setFilters={setNewFilters} />
          </Card>
        </Box>
        <ApplyFilterButton onClick={applyFilters} applyButtonType={getApplyButtonType()} />
      </SwipeableDrawer>
    </Box>
  );
}

// News Card Styles
const cardStyles = {
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  background: 'rgba(255, 255, 255, 0.10)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  height: 'fit-content !important',
  marginBottom: 4,
};

const drawerBoxStyle = {
  overflow: 'scroll',
  p: 3,
  pb: 0,
  m: '15px',
  mb: 0,
  borderRadius: '16px',
  border: '1px solid rgba(0, 90, 140, 0.20)',
  backgroundColor: 'primary.light',
  boxShadow:
    '0px 6px 6px -3px rgba(0, 0, 0, 0.05), 0px 10px 22px 1px rgba(0, 0, 0, 0.14), 0px 4px 26px 3px rgba(0, 0, 0, 0.12)',
};
