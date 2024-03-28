import { PropsWithChildren, RefObject } from 'react';

import Button from '@mui/material/Button';
import { ButtonProps } from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type CustomIconButtonProps = PropsWithChildren & ButtonProps & { buttonRef?: RefObject<HTMLButtonElement> };

export const CustomIconButton = ({ children, sx, buttonRef, ...buttonProps }: CustomIconButtonProps) => {
  return (
    <Button
      variant="outlined"
      sx={[iconButtonStyle, ...(Array.isArray(sx) ? sx : [sx])]}
      ref={buttonRef}
      {...buttonProps}
    >
      <Typography variant="subtitle2" sx={iconButtonTypographyStyle}>
        {children}
      </Typography>
    </Button>
  );
};

const iconButtonStyle = {
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
