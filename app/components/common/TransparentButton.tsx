'use client';
import React, { PropsWithChildren } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import theme from '@/styles/theme';

type TransparenButtonProps = PropsWithChildren & {
  onClick?: () => void;
  icon?: React.JSX.Element;
  sx?: SxProps;
  textSx?: SxProps;
};

export const TransparentButton = ({ onClick, icon, children, sx, textSx }: TransparenButtonProps) => {
  const buttonStyle = {
    width: 300,
    px: 0,
    py: 1,
    mb: 2,
    pr: 1,
    background: 'transparent',
    color: theme.palette.secondary.main,
    ':hover': {
      background: 'transparent',
      color: theme.palette.secondary.main,
    },
    ...sx,
  };

  const textStyle = {
    fontSize: '14px',
    fontWeight: '500',
    ...textSx,
  };

  return (
    <Button
      sx={buttonStyle}
      onClick={() => onClick && onClick()}
      startIcon={icon ? icon : <AddIcon color="secondary" fontSize="large" />}
    >
      <Typography variant="subtitle2" sx={textStyle}>
        {children}
      </Typography>
    </Button>
  );
};
