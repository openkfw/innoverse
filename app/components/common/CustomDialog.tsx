'use client';

import React, { FC, ReactNode } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { SxProps } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';

import CloseIcon from '@/components/icons/CloseIcon';
import { mergeStyles } from '@/utils/helpers';

interface CustomDialogProps {
  children: ReactNode;
  open: boolean;
  handleClose?: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  closeIcon?: boolean;
  sx?: SxProps;
  titleSx?: SxProps;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children?: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  const { children, ...otherProps } = props;
  return children ? (
    <Slide direction="up" ref={ref} {...otherProps}>
      {children}
    </Slide>
  ) : null;
});

const CustomDialog: FC<CustomDialogProps> = ({
  children,
  open,
  handleClose,
  title,
  subtitle,
  sx,
  titleSx,
  closeIcon = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: mergeStyles(paperPropsStyle, sx),
      }}
      TransitionComponent={Transition}
      maxWidth={false}
      slotProps={{
        backdrop: { style: { backdropFilter: 'blur(1px)' } },
      }}
    >
      {closeIcon && (
        <DialogActions sx={dialogActionsStyle}>
          <IconButton data-user-interaction-id={`dialog-close-button`} onClick={handleClose} sx={closeIconButtonStyle}>
            <CloseIcon color="#41484C" />
          </IconButton>
        </DialogActions>
      )}

      <DialogTitle sx={dialogTitleStyle}>
        <Box sx={titleSx}>{title}</Box>
        {subtitle && <Box>{subtitle}</Box>}
      </DialogTitle>

      <DialogContent sx={dialogContentStyle}>{children}</DialogContent>
    </Dialog>
  );
};

export default CustomDialog;

// Custom Dialog Styles
const paperPropsStyle = {
  backgroundColor: 'transparent',
  boxShadow: 'none',
  width: { xs: 'calc(100% - 10px)', sm: 'calc(100% - 50px)', md: '60%', lg: '45%' },
  maxWidth: { xs: 'calc(100% - 10px)', sm: 'calc(100% - 50px)', md: '60%', lg: '45%' },
};

export const closeIconButtonStyle = {
  width: 48,
  height: 48,
  borderRadius: 48,
  border: '2px solid #D4FCCA',
  backgroundColor: 'action.hover',
  backdropFilter: 'blur(24px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ':hover': {
    border: '2px solid',
    borderColor: 'action.hover',
    backgroundColor: '#94EB90',
    boxShadow: '0px 12px 32px 0px rgba(0, 0, 0, 0.25), 0px 4px 8px 0px rgba(0, 0, 0, 0.10)',
  },
};

const dialogTitleStyle = {
  padding: 3,
  paddingBottom: 1,
  margin: 0,
  color: 'primary.main',
  backgroundColor: 'common.white',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  border: 'none',
  outline: 'none',
  fontSize: { xs: '16px', lg: '18px' },
};

const dialogActionsStyle = {
  backgroundColor: 'transparent',
  marginTop: 8,
  justifyContent: 'right',
  paddingRight: 0,
};

const dialogContentStyle = {
  margin: 0,
  backgroundColor: 'common.white',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px',
  border: 'none',
  outline: 'none',
};
