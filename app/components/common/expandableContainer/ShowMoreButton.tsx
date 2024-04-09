import React, { CSSProperties } from 'react';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { mergeStyles } from '@/utils/helpers';

interface ShowMoreButtonProps {
  isVisible: boolean;
  onClick: () => void;
  top: number;
  backgroundColor?: CSSProperties['backgroundColor'];
}

export const ShowMoreButton = ({ isVisible, top, backgroundColor, onClick }: ShowMoreButtonProps) => {
  if (!isVisible) return <></>;
  backgroundColor ??= 'rgba(255, 255, 255, 1)';
  return (
    <Box sx={mergeStyles(showMoreButtonStyles(backgroundColor), { top: top })}>
      <IconButton
        sx={{ color: 'rgba(0, 0, 0, 1)' }}
        onClick={onClick}
        data-user-interaction-id={`expand-content-button`}
      >
        <ArrowDownwardIcon />
      </IconButton>
    </Box>
  );
};
const showMoreButtonStyles = (backgroundColor: CSSProperties['backgroundColor']) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  width: 'auto',
  textAlign: 'center',
  borderRadius: '4px',
  background: `linear-gradient(to bottom, transparent, ${backgroundColor})`,
  paddingTop: '150px',
  marginTop: '-193px',
});
