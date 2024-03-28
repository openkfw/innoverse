import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';

import DeleteFilledIcon from '../../../icons/DeleteFilled';
import EditFilledIcon from '../../../icons/EditFilled';
import { CustomIconButton } from '../../CustomIconButton';

interface EditMoreDialogProps {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  onClickAway: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const EditMoreDialog = ({ open, anchorEl, onClickAway, onEdit, onDelete }: EditMoreDialogProps) => {
  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
      <ClickAwayListener onClickAway={onClickAway}>
        <Stack
          direction={'column'}
          alignItems={'start'}
          sx={{ borderRadius: '8px', p: 1, bgcolor: 'background.paper', zIndex: 1, boxShadow: 2 }}
        >
          <CustomIconButton
            onClick={onEdit}
            startIcon={<EditFilledIcon />}
            sx={{ p: 2, width: '140px', maxWidth: '100%' }}
          >
            bearbeiten
          </CustomIconButton>
          <CustomIconButton
            onClick={onDelete}
            startIcon={<DeleteFilledIcon />}
            sx={{ p: 2, width: '140px', maxWidth: '100%' }}
          >
            löschen
          </CustomIconButton>
        </Stack>
      </ClickAwayListener>
    </Popper>
  );
};
