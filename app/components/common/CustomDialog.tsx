import { FC, ReactNode } from 'react';

import { DialogActions, IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fade from '@mui/material/Fade';

import CloseIcon from '@/components/icons/CloseIcon';

interface CustomDialogProps {
  children: ReactNode;
  open: boolean;
  handleClose: () => void;
  title?: string;
}

const CustomDialog: FC<CustomDialogProps> = ({ children, open, handleClose, title }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ style: { backgroundColor: 'transparent', boxShadow: 'none', marginTop: -95 } }}
      TransitionComponent={({ children, in: open }) => (
        <Fade in={open} timeout={500}>
          {children}
        </Fade>
      )}
    >
      <DialogActions
        sx={{
          backgroundColor: 'transparent',
          marginTop: 8,
          justifyContent: 'right',
          paddingRight: 0,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            width: 48,
            height: 48,
            borderRadius: 48,
            border: '2px solid #FFF',
            backgroundColor: '#99A815',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogActions>

      <DialogTitle
        sx={{
          paddingBottom: 1,
          margin: 0,
          backgroundColor: 'white',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
        }}
      >
        <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'primary.light' }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          margin: 0,
          width: 458,
          backgroundColor: 'white',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
