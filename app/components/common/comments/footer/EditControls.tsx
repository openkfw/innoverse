import { useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useMediaQuery } from '@mui/material';
import Stack from '@mui/material/Stack';

import theme from '@/styles/theme';

import DeleteFilledIcon from '../../../icons/DeleteFilled';
import EditFilledIcon from '../../../icons/EditFilled';
import { CustomIconButton } from '../../CustomIconButton';

import { EditMoreDialog } from './EditMoreDialog';

interface EditControlsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const EditControls = ({ onEdit, onDelete }: EditControlsProps) => {
  const [openEditMoreDialog, setOpenEditMoreDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const useMobileMenu = useMediaQuery(theme.breakpoints.down(1025));

  const toggleEditMoreDialog = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      setAnchorEl(event.currentTarget);
    }
    setOpenEditMoreDialog((open) => !open);
  };

  const handleEdit = () => {
    setOpenEditMoreDialog(false);
    onEdit();
  };

  const handleDelete = () => {
    setOpenEditMoreDialog(false);
    onDelete();
  };

  return (
    <Stack direction={'row'}>
      {useMobileMenu && (
        <>
          <CustomIconButton onClick={toggleEditMoreDialog} startIcon={<MoreVertIcon sx={{ ml: 1 }} />} sx={{ p: 0 }} />
        </>
      )}
      {!useMobileMenu && (
        <>
          <CustomIconButton onClick={onEdit} startIcon={<EditFilledIcon />}>
            bearbeiten
          </CustomIconButton>
          <CustomIconButton onClick={onDelete} startIcon={<DeleteFilledIcon />}>
            löschen
          </CustomIconButton>
        </>
      )}
      <EditMoreDialog
        open={openEditMoreDialog}
        anchorEl={anchorEl}
        onClickAway={() => setOpenEditMoreDialog(false)}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </Stack>
  );
};
