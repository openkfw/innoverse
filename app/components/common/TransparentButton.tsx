'use client';
import React, { CSSProperties, PropsWithChildren } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import theme from '@/styles/theme';

type TransparenButtonProps = PropsWithChildren & {
  onClick?: () => void;
  icon?: React.JSX.Element;
  sx?: SxProps;
  style?: CSSProperties;
  textSx?: SxProps;
};

export const TransparentButton = ({ onClick, icon, children, sx, textSx, style }: TransparenButtonProps) => {
  const buttonStyle: SxProps = {
    width: 'fit-content',
    px: 2,
    py: 1,
    mb: 2,
    whiteSpace: 'nowrap',
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
      style={style}
      onClick={() => onClick && onClick()}
      startIcon={icon ? icon : <AddIcon color="secondary" fontSize="large" />}
    >
      <Typography variant="subtitle2" sx={textStyle}>
        {children}
      </Typography>
    </Button>
  );
};
