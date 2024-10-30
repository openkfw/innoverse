'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';

import CloseIcon from '@/components/icons/CloseIcon';
import theme from '@/styles/theme';
import ApplyFilterButton from './ApplyFilterButton';
import { closeIconButtonStyle } from '@/components/common/CustomDialog';
import * as m from '@/src/paraglide/messages.js';

interface MobileFilterDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  applyFilters: () => void;
  applyButtonType: string;
  FilterContent: React.ReactNode;
}

export default function MobileFilterDrawer(props: MobileFilterDrawerProps) {
  const { open, setOpen, applyFilters, applyButtonType, FilterContent } = props;

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Box mb={0} sx={{ backgroundColor: theme.palette.background.paper }}>
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
          <Card sx={cardStyles}>{FilterContent}</Card>
        </Box>

        <ApplyFilterButton onClick={applyFilters} applyButtonType={applyButtonType} />
      </SwipeableDrawer>
    </Box>
  );
}

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
