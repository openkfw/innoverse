'use client';

import { signIn } from 'next-auth/react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { getProviderLabel } from '@/utils/helpers';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

export interface LoginProviderRowProps {
  provider: { name: string; id: string };
}

export default function LoginProviderRow(props: LoginProviderRowProps) {
  const { provider } = props;

  return (
    <Grid container justifyItems="space-between" sx={{ pb: '10px' }} justifyContent="center" alignItems="center">
      <Grid container item direction="row" xs={5} spacing={1}>
        <Grid item>
          <Box
            style={{
              width: 48,
              height: 48,
              background: '#D9D9D9',
              borderRadius: 9999,
            }}
          />
        </Grid>
        <Grid container item direction="column" spacing={1} xs={6} justifyContent="center">
          <Grid item>
            <Box style={{ width: 96, height: 16, background: '#D9D9D9', borderRadius: 40 }} />
          </Grid>
          <Grid item>
            <Box style={{ width: 80, height: 8, background: '#D9D9D9', borderRadius: 40 }} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container xs={7} justifyContent="end">
        <InteractionButton
          key={provider.name}
          interactionType={InteractionType.LOG_IN}
          label={getProviderLabel(provider)}
          onClick={() => signIn(provider.id)}
        />
      </Grid>
    </Grid>
  );
}
