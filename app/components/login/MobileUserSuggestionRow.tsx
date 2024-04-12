'use client';

import React from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AvatarInitialsIcon from '../common/AvatarInitialsIcon';
import CustomDialog from '../common/CustomDialog';
import InteractionButton, { InteractionType } from '../common/InteractionButton';

import { UserSuggestionRowProps } from './UserSuggestionRow';

export default function MobileUserSuggestionRow(props: UserSuggestionRowProps) {
  const { provider, name, image, handleRemoveCookie, handleToggleCollapse, open } = props;
  const [confirmationDialogOpen, setConfirmationDialogOpen] = React.useState(false);

  function handleOpenConfirmationDialog() {
    setConfirmationDialogOpen(true);
  }

  function handleCloseConfirmationDialog() {
    setConfirmationDialogOpen(false);
  }

  function handleConfirm() {
    handleRemoveCookie();
    handleCloseConfirmationDialog;
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        {image ? (
          <Avatar sx={{ width: 25, height: 25, border: '2px solid white' }}>
            <Image src={image} alt="avatar" fill sizes="33vw" />
          </Avatar>
        ) : (
          <AvatarInitialsIcon name={name} size={25} sx={{ border: '2px solid white' }} />
        )}
        <Typography
          variant="body2"
          sx={{ color: 'text.primary', fontWeight: 300, fontSize: '14px', alignSelf: 'center' }}
        >
          {name}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <InteractionButton
          key={provider.name}
          interactionType={InteractionType.LOG_IN}
          label={`Log in with ${provider.name.split(' ')[0]}`}
          onClick={() => signIn(provider.id)}
        />

        <IconButton color="inherit" onClick={handleOpenConfirmationDialog}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Divider textAlign="left" />
      <Stack onClick={handleToggleCollapse} direction="row">
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 300, fontSize: '13px' }}>
          Nicht du? Mit einem anderen Account einloggen.
        </Typography>
        {open ? <ExpandLess /> : <ExpandMore />}
      </Stack>
      <CustomDialog
        open={confirmationDialogOpen}
        handleClose={handleCloseConfirmationDialog}
        title="Confirmation"
        subtitle="Bitte bestätige das Entfernen von dem User "
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <InteractionButton interactionType={InteractionType.CLEAR} onClick={handleConfirm} sx={{ width: '150px' }} />
        </Box>
      </CustomDialog>
    </>
  );
}