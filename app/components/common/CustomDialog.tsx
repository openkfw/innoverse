import { FC, ReactNode } from 'react';
import React from 'react';

import { DialogActions, IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import CloseIcon from '@/components/icons/CloseIcon';

interface CustomDialogProps {
  children: ReactNode;
  open: boolean;
  handleClose: () => void;
  title?: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  const { children, ...otherProps } = props;
  return children ? (
    <Slide direction="up" ref={ref} {...otherProps}>
      {children}
    </Slide>
  ) : null;
});

const CustomDialog: FC<CustomDialogProps> = ({ children, open, handleClose, title }) => {
  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ style: paperPropsStyle }} TransitionComponent={Transition}>
      <DialogActions sx={dialogActionsStyle}>
        <IconButton onClick={handleClose} sx={iconButtonStyle}>
          <CloseIcon />
        </IconButton>
      </DialogActions>

      <DialogTitle sx={dialogTitleStyle}>
        <Typography variant="caption" sx={typographyStyle}>
          {title}
        </Typography>
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

const iconButtonStyle = {
  width: 48,
  height: 48,
  borderRadius: 48,
  border: '2px solid #FFF',
  backgroundColor: '#99A815',
  backdropFilter: 'blur(24px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const dialogTitleStyle = {
  paddingBottom: 1,
  margin: 0,
  backgroundColor: 'white',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
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
};

const typographyStyle = {
  textTransform: 'uppercase',
  color: 'primary.light',
};