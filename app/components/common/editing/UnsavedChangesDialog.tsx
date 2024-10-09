import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import CustomButton from '../CustomButton';

import { useUnsavedChangesDialog } from './editing-context';

interface UnsavedChangesDialogProps {
  open: boolean;
  onProceed: () => void;
  onDismiss: () => void;
}

export const UnsavedEditingChangesDialog = () => {
  // The 'useUnsavedEditingChangesDialog' hook causes this component to rerender
  // whenever a user initiates/discards an edit or response. Isolating this into
  // a separate components can help reduce rerendering overhead.
  const dialog = useUnsavedChangesDialog();
  return dialog;
};

export const UnsavedChangesDialog = ({ open, onProceed, onDismiss }: UnsavedChangesDialogProps) => {
  return (
    <Dialog
      open={open}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          border: '1px solid rgba(0, 90, 140, 0.20)',
          background: '#FFFFFF',
          boxShadow:
            '0px 4px 26px 3px rgba(0, 0, 0, 0.12), 0px 10px 22px 1px rgba(0, 0, 0, 0.14), 0px 6px 6px -3px rgba(0, 0, 0, 0.05)',
          width: 'auto',
        },
      }}
    >
      <ClickAwayListener onClickAway={onDismiss}>
        <Box sx={containerStyle}>
          <CloseIcon onClick={onDismiss} sx={closeIconStyle} />
          <Typography variant="body2" color="text.primary" sx={textStyle}>
            {m.components_common_editing_unsavedChangesDialog_throw()}
          </Typography>
          <Stack direction={'row'} alignItems={'flex-start'} gap={'8px'} flexWrap={'wrap'}>
            <CustomButton
              themeVariant="secondary"
              startIcon={<></>}
              endIcon={<></>}
              onClick={onDismiss}
              sx={buttonStyle}
            >
              {m.components_common_editing_unsavedChangesDialog_cancel()}
            </CustomButton>
            <CustomButton
              themeVariant="secondary"
              startIcon={<></>}
              endIcon={<></>}
              onClick={onProceed}
              sx={{
                ...buttonStyle,
                backgroundColor: '#B7F9AA',
              }}
            >
              {m.components_common_editing_unsavedChangesDialog_confirmThrow()}
            </CustomButton>
          </Stack>
        </Box>
      </ClickAwayListener>
    </Dialog>
  );
};

const containerStyle: SxProps = {
  p: { xs: 2, sm: 4 },
  width: '760px',
  maxWidth: '100%',
};

const textStyle: SxProps = {
  mb: { xs: 2, sm: 3 },
  fontWeight: '700',
  lineHeight: '175%',
};

const buttonStyle: SxProps = {
  width: { xs: 'auto', sm: 'fit-content' },
  px: { xs: '13px', sm: '24px' },
  height: '48px',
  fontSize: '20px',
  border: '2px solid #ECFDED',
  color: '#41484C',
  '&:hover': { border: '2px solid rgba(255, 255, 255, 0.40)' },
};

const closeIconStyle: SxProps = {
  cursor: 'pointer',
  position: 'absolute',
  right: '14px',
  top: '14px',
  marginTop: '5px',
  color: 'rgba(0, 0, 0, 0.56)',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
};
