import React from 'react';

import { ArrowUpward } from '@mui/icons-material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

interface ShowLessButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export const ShowLessButton = ({ isVisible, onClick }: ShowLessButtonProps) => {
  if (!isVisible) return <></>;
  return (
    <Box sx={showLessButonStyles}>
      <IconButton sx={{ color: 'rgba(0, 0, 0, 1)' }} onClick={onClick}>
        <ArrowUpward />
      </IconButton>
    </Box>
  );
};
const showLessButonStyles = {
  width: 'auto',
  textAlign: 'center',
  borderRadius: '4px',
  paddingBottom: '10px',
  paddingTop: '10px',
};
