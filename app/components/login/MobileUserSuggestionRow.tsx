'use client';

import React from 'react';
import { signIn } from 'next-auth/react';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';
import { getProviderLabel } from '@/utils/helpers';

import AvatarIcon from '../common/AvatarIcon';
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
        <AvatarIcon user={{ name, image }} size={25} />
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
          label={getProviderLabel(provider)}
          onClick={() => signIn(provider.id)}
        />

        <IconButton color="inherit" onClick={handleOpenConfirmationDialog}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Divider textAlign="left" />
      <Stack onClick={handleToggleCollapse} direction="row">
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 300, fontSize: '13px' }}>
          {m.components_login_mobileUserSuggestionRow_notYouSuggestion()}
        </Typography>
        {open ? <ExpandLess /> : <ExpandMore />}
      </Stack>
      <CustomDialog
        open={confirmationDialogOpen}
        handleClose={handleCloseConfirmationDialog}
        title={m.components_login_mobileUserSuggestionRow_confirmation()}
        subtitle={m.components_login_mobileUserSuggestionRow_confirmationMessage()}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <InteractionButton interactionType={InteractionType.CLEAR} onClick={handleConfirm} sx={{ width: '150px' }} />
        </Box>
      </CustomDialog>
    </>
  );
}
