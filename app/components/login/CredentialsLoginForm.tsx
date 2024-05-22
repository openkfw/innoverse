'use client';

import { ChangeEvent, useState } from 'react';
import React from 'react';
import { signIn } from 'next-auth/react';

import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ArrowLeftIcon } from '@mui/x-date-pickers';

import CustomButton from '@/components/common/CustomButton';

interface CredentialsLoginFormProps {
  providerId: string;
  onNavigateBack: () => void;
}

export function useCredentialsLoginForm() {
  const [providerId, setProviderId] = useState<string>();

  const openForm = (providerId: string) => {
    setProviderId(providerId);
  };

  const closeForm = () => {
    setProviderId(undefined);
  };

  return {
    open: providerId !== undefined,
    providerId,
    openForm,
    closeForm,
    navigateBack: closeForm,
  };
}

export const CredentialsLoginForm = ({ providerId, onNavigateBack }: CredentialsLoginFormProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>();

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  const handleSubmit = async () => {
    const result = await signIn(providerId, { redirect: false, username, password });
    if (result?.ok) {
      window.location.href = '/';
    } else {
      setError('Ungültige Zugangsdaten');
    }
  };

  return (
    <Stack direction={'column'} spacing={2}>
      <Stack
        direction={'row'}
        alignItems={'center'}
        role="button"
        sx={{ cursor: 'pointer', width: 'fit-content' }}
        onClick={onNavigateBack}
      >
        <ArrowLeftIcon color="action" />
        <Typography color={'text.primary'}>Anderen Account verwenden</Typography>
      </Stack>
      <TextField
        label="Benutzername"
        value={username}
        onChange={handleUsernameChange}
        InputLabelProps={{ sx: inputLabelStyles }}
      />
      <TextField
        label="Passwort"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        InputLabelProps={{ sx: inputLabelStyles }}
      />
      <Typography variant="caption" sx={{ visibility: error ? 'visible' : 'hidden' }} color="error.main">
        Fehler: {error}
      </Typography>
      <CustomButton sx={{ color: 'black' }} disabled={!username || !password} onClick={handleSubmit}>
        Login
      </CustomButton>
    </Stack>
  );
};

const inputLabelStyles: SxProps = {
  color: '#A9A9AC',
  '&.Mui-focused': { color: 'black' },
};
