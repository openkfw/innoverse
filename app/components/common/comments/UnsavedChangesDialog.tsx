import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, ClickAwayListener, Dialog, Stack, SxProps, Typography } from '@mui/material';

import CustomButton from '../CustomButton';

import { useUnsavedCommentChangesDialog } from './comment-context';

interface UnsavedChangesDialogProps {
  open: boolean;
  onProceed: () => void;
  onDismiss: () => void;
}

export const UnsavedCommentChangesDialog = () => {
  // The 'useUnsavedCommentChangesDialog' hook causes this component to rerender
  // whenever a user initiates/discards an edit or response to a comment. Isolating this into
  // a separate components can help reduces rerendering overhead.
  const dialog = useUnsavedCommentChangesDialog();
  return dialog;
};

export const UnsavedChangesDialog = ({ open, onProceed, onDismiss }: UnsavedChangesDialogProps) => {
  return (
    <Dialog open={open}>
      <ClickAwayListener onClickAway={onDismiss}>
        <Box sx={containerStyle}>
          <Typography variant="overline" color="primary.main" sx={{ fontSize: 14 }}>
            Edit
          </Typography>
          <Typography variant="body2" color="text.primary" sx={textStyle}>
            Möchten Sie diese Bearbeitung verwerfen?
          </Typography>
          <Stack direction={'row'} spacing={1} rowGap={1} justifyContent={'end'} flexWrap={'wrap'}>
            <CustomButton
              themeVariant="secondary"
              startIcon={<CloseIcon sx={{ ml: 1 }} />}
              endIcon={<></>}
              onClick={onDismiss}
              sx={buttonStyle}
            >
              Abbrechen
            </CustomButton>
            <CustomButton
              themeVariant="secondary"
              startIcon={<CheckIcon sx={{ ml: 1 }} />}
              endIcon={<></>}
              onClick={onProceed}
              sx={buttonStyle}
            >
              Verwerfen
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
