'use client';
import React, { CSSProperties, PropsWithChildren } from 'react';

import Button, { ButtonProps } from '@mui/material/Button';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import theme from '@/styles/theme';
import { mergeStyles } from '@/utils/helpers';

type TransparenButtonProps = PropsWithChildren &
  ButtonProps & {
    sx?: SxProps;
    style?: CSSProperties;
    textSx?: SxProps;
  };

export const TransparentButton = ({ children, sx, textSx, style, ...buttonProps }: TransparenButtonProps) => {
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
  };

  const textStyle = {
    fontSize: '14px',
    fontWeight: '500',
    ...textSx,
  };

  return (
    <Button sx={mergeStyles(buttonStyle, sx)} style={style} {...buttonProps}>
      <Typography variant="subtitle2" sx={textStyle}>
        {children}
      </Typography>
    </Button>
  );
};
