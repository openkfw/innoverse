'use client';

import React from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { getProviderLabel } from '@/utils/helpers';

import AvatarInitialsIcon from '../common/AvatarInitialsIcon';
import CustomDialog from '../common/CustomDialog';
import InteractionButton, { InteractionType } from '../common/InteractionButton';

export interface UserSuggestionRowProps {
  provider: { name: string; id: string };
  name: string;
  image?: string;
  handleRemoveCookie: () => void;
  handleToggleCollapse: () => void;
  open: boolean;
}

export default function UserSuggestionRow(props: UserSuggestionRowProps) {
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
      <Grid container justifyItems="space-between">
        <Grid container item direction="row" xs={6} spacing={1}>
          <Grid item>
            {image ? (
              <Avatar sx={{ width: 40, height: 40, border: '2px solid white' }}>
                <Image src={image} alt="avatar" fill sizes="33vw" />
              </Avatar>
            ) : (
              <AvatarInitialsIcon name={name} size={40} sx={{ border: '2px solid white' }} />
            )}
          </Grid>
          <Grid container item direction="column" spacing={1} xs={8} justifyContent="center">
            <Grid item>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 300 }}>
                {name}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={5} justifyContent="flex-end" alignContent="center">
          <InteractionButton
            key={provider.name}
            interactionType={InteractionType.LOG_IN}
            label={getProviderLabel(provider)}
            onClick={() => signIn(provider.id)}
          />
        </Grid>
        <Grid item container xs={1} justifyContent="flex-end" alignContent="center">
          <IconButton color="inherit" onClick={handleOpenConfirmationDialog}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
      <Divider textAlign="left" />
      <Grid container onClick={handleToggleCollapse}>
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 300 }}>
          Nicht du? Mit einem anderen Account einloggen.
        </Typography>
        {open ? <ExpandLess /> : <ExpandMore />}
      </Grid>
      <CustomDialog
        open={confirmationDialogOpen}
        handleClose={handleCloseConfirmationDialog}
        title="Confirmation"
        subtitle="Bitte bestätige das Entfernen von dem User "
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <InteractionButton interactionType={InteractionType.CLEAR} onClick={handleConfirm} sx={{ width: '200px' }} />
        </Box>
      </CustomDialog>
    </>
  );
}
