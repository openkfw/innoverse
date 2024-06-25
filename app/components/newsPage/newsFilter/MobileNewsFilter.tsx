'use client';

import React, { useCallback, useState } from 'react';
import { isEqual } from 'lodash';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';

import { useNewsFilter } from '@/app/contexts/news-filter-context';
import { closeIconButtonStyle } from '@/components/common/CustomDialog';
import CloseIcon from '@/components/icons/CloseIcon';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import ApplyFilterButton, { APPLY_BUTTON } from './ApplyFilterButton';
import NewsProjectsFilter from './NewsProjectsFilter';
import NewsTopicFilter from './NewsTopicFilter';

interface MobileNewsFilterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MobileNewsFilter(props: MobileNewsFilterProps) {
  const { open, setOpen } = props;
  const { filters, setFilters } = useNewsFilter();
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
          <Typography variant="overline">{m.components_newsPage_newsFilter_mobileNewsFilter_filter()}</Typography>
          <Card sx={cardStyles}>
            <NewsProjectsFilter filters={newFilters} setFilters={setNewFilters} />
            <NewsTopicFilter filters={newFilters} setFilters={setNewFilters} />
          </Card>
        </Box>
        <ApplyFilterButton onClick={applyFilters} applyButtonType={getApplyButtonType()} />
      </SwipeableDrawer>
    </Box>
  );
}

// News Card Styles
const cardStyles = {
  borderRadius: '16px 16px 0 0',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  background: 'rgba(255, 255, 255, 0.10)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  height: '120% !important',
};

const drawerBoxStyle = {
  overflow: 'scroll',
  p: 3,
  pb: 0,
  m: '15px',
  mb: 0,
  borderRadius: '16px 16px 0 0',
  border: '1px solid rgba(0, 90, 140, 0.20)',
  backgroundColor: 'primary.light',
  boxShadow:
    '0px 6px 6px -3px rgba(0, 0, 0, 0.05), 0px 10px 22px 1px rgba(0, 0, 0, 0.14), 0px 4px 26px 3px rgba(0, 0, 0, 0.12)',
};
