import { FC, ReactNode } from 'react';
import React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { SxProps } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';

import CloseIcon from '@/components/icons/CloseIcon';

interface CustomDialogProps {
  children: ReactNode;
  open: boolean;
  handleClose?: () => void;
  title?: string;
  closeIcon?: boolean;
  sx?: SxProps;
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

const CustomDialog: FC<CustomDialogProps> = ({ children, open, handleClose, title, sx, closeIcon = true }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={sx}
      PaperProps={{ style: paperPropsStyle }}
      TransitionComponent={Transition}
    >
      {closeIcon && (
        <DialogActions sx={dialogActionsStyle}>
          <IconButton onClick={handleClose} sx={iconButtonStyle}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
      )}

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
