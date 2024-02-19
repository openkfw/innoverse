'use client';
import React, { PropsWithChildren } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import theme from '@/styles/theme';

type TransparenButtonProps = PropsWithChildren & {
  onClick?: () => void;
  sx?: SxProps;
};

export const TransparentButton = ({ onClick, children, sx }: TransparenButtonProps) => {
  const buttonStyle = {
    width: 300,
    px: 0,
    py: 1,
    mb: 3,
    background: 'transparent',
    color: theme.palette.secondary.main,
    ':hover': {
      background: 'transparent',
      color: theme.palette.secondary.main,
    },
    ...sx,
  };

  return (
    <Button
      sx={buttonStyle}
      onClick={() => onClick && onClick()}
      startIcon={<AddIcon color="secondary" fontSize="large" />}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        {children}
      </Typography>
    </Button>
  );
};
