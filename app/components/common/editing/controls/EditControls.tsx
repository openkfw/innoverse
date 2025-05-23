'use client';

import { useState } from 'react';

import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';

import { ConfirmDeleteDialog } from '../ConfirmDeleteDialog';

interface EditControlsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const EditControls = (props: EditControlsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { onEdit, onDelete } = props;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit();
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    setOpenDeleteDialog(false);
    onDelete();
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <Stack direction="row">
      <IconButton onClick={handleMenuOpen} aria-label="more options" sx={menuIconButtonStyles(anchorEl !== null)}>
        <MoreVertIcon sx={iconStyles} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={menuSlotPropsStyles}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon sx={iconStyles} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" sx={listItemTypographyStyles}>
              {m.components_common_editing_controls_editControls_edit()}
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon sx={iconStyles} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" sx={listItemTypographyStyles}>
              {m.components_common_editing_controls_editControls_delete()}
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
      <ConfirmDeleteDialog open={openDeleteDialog} onConfirm={confirmDelete} onCancel={cancelDelete} />
    </Stack>
  );
};

// Edit Controls Styles
const menuIconButtonStyles = (open: boolean) => ({
  width: '32px',
  height: '32px',
  maxWidth: '32px',
  maxHeight: '32px',
  padding: '0 8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '48px',
  border: `1px solid ${open ? '#6D767D' : '#D8DFE3'}`,
  backgroundColor: 'transparent',
});

const menuSlotPropsStyles = {
  paper: {
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))',
      mt: 1.5,
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  },
};

const listItemTypographyStyles = {
  color: 'text.primary',
};

const iconStyles = {
  color: '#41484C',
};
