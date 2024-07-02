import { PropsWithChildren, RefObject } from 'react';

import Button, { ButtonProps } from '@mui/material/Button';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { mergeStyles } from '../../utils/helpers';

type CustomIconButtonProps = PropsWithChildren &
  ButtonProps & { sx?: SxProps; buttonRef?: RefObject<HTMLButtonElement>; textSx?: SxProps };

export const CustomIconButton = ({ children, sx, buttonRef, textSx, ...buttonProps }: CustomIconButtonProps) => {
  return (
    <Button variant="text" sx={mergeStyles(iconButtonStyles, sx)} ref={buttonRef} {...buttonProps}>
      <Typography variant="subtitle2" sx={mergeStyles(iconButtonTypographyStyle, textSx)}>
        {children}
      </Typography>
    </Button>
  );
};

const iconButtonStyles: SxProps = {
  color: 'rgba(0, 0, 0, 0.56)',
  borderRadius: '48px',
  fontSize: '13px',
  fontWeight: '700',
  lineHeight: '19px',
  background: 'rgba(255, 255, 255, 0.10)',
  height: '32px',
  minWidth: 'fit-content',
  px: 1,
  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.10)' },
  '&:active': { backgroundColor: 'rgba(0, 0, 0, 0.10)' },
  '& .MuiButton-startIcon': {
    mr: 0.5,
  },
};

export const iconButtonTypographyStyle = {
  color: 'rgba(0, 0, 0, 0.56)',
  fontSize: 13,
  fontWeight: 700,
};
