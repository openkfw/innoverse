import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';

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
    <Dialog open={open}>
      <ClickAwayListener onClickAway={onDismiss}>
        <Box sx={containerStyle}>
          <Typography variant="overline" color="primary.main" sx={{ fontSize: 14 }}>
            {m.components_common_editing_unsavedChangesDialog_edit()}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={textStyle}>
            {m.components_common_editing_unsavedChangesDialog_throw()}
          </Typography>
          <Stack direction={'row'} spacing={1} rowGap={1} justifyContent={'end'} flexWrap={'wrap'}>
            <CustomButton
              themeVariant="secondary"
              startIcon={<CloseIcon sx={{ ml: 1 }} />}
              endIcon={<></>}
              onClick={onDismiss}
              sx={buttonStyle}
            >
              {m.components_common_editing_unsavedChangesDialog_cancel()}
            </CustomButton>
            <CustomButton
              themeVariant="secondary"
              startIcon={<CheckIcon sx={{ ml: 1 }} />}
              endIcon={<></>}
              onClick={onProceed}
              sx={buttonStyle}
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
  p: 3,
  width: '760px',
  maxWidth: '100%',
};

const textStyle: SxProps = {
  mt: 1,
  mb: { xs: 3, sm: 1 },
};

const buttonStyle: SxProps = {
  width: { xs: '100%', sm: 'fit-content' },
};
