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

interface CustomDialogProps {
  children: ReactNode;
  open: boolean;
  handleClose?: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  closeIcon?: boolean;
  sx?: SxProps;
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
  closeIcon = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={sx}
      PaperProps={{ style: paperPropsStyle }}
      TransitionComponent={Transition}
      maxWidth={false}
    >
      {closeIcon && (
        <DialogActions sx={dialogActionsStyle}>
          <IconButton onClick={handleClose} sx={closeIconButtonStyle}>
            <CloseIcon color="#41484C" />
          </IconButton>
        </DialogActions>
      )}

      <DialogTitle sx={dialogTitleStyle}>
        <Box>{title}</Box>

        <Box>{subtitle}</Box>
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
  marginTop: -95,
};

export const closeIconButtonStyle = {
  width: 48,
  height: 48,
  borderRadius: 48,
  border: '2px solid #D4FCCA',
  backgroundColor: '#B7F9AA',
  backdropFilter: 'blur(24px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  ':hover': {
    border: '2px solid #B7F9AA',
    backgroundColor: '#94EB90',
    boxShadow: '0px 12px 32px 0px rgba(0, 0, 0, 0.25), 0px 4px 8px 0px rgba(0, 0, 0, 0.10)',
  },
};

const dialogTitleStyle = {
  paddingBottom: 1,
  margin: 0,
  backgroundColor: 'white',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  border: 'none',
  outline: 'none',
};

const dialogActionsStyle = {
  backgroundColor: 'transparent',
  marginTop: 8,
  justifyContent: 'right',
  paddingRight: 0,
};

const dialogContentStyle = {
  margin: 0,
  backgroundColor: 'white',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px',
  border: 'none',
  outline: 'none',
};
