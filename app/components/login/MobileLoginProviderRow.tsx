'use client';

import { signIn } from 'next-auth/react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

import { LoginProviderRowProps } from './LoginProviderRow';

export default function MobileLoginProviderRow(props: LoginProviderRowProps) {
  const { provider } = props;

  return (
    <Grid container justifyItems="space-between" pb="10px" justifyContent="center" alignItems="center">
      <Grid container item direction="row" xs={4} spacing={1}>
        <Grid item>
          <Box
            style={{
              width: 30,
              height: 30,
              background: '#D9D9D9',
              borderRadius: 9999,
            }}
          />
        </Grid>
        <Grid container item direction="column" spacing={1} xs={6} justifyContent="center">
          <Grid item>
            <Box style={{ width: 40, height: 10, background: '#D9D9D9', borderRadius: 40 }} />
          </Grid>
          <Grid item>
            <Box style={{ width: 25, height: 6, background: '#D9D9D9', borderRadius: 40 }} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container xs={8} justifyContent="center">
        <InteractionButton
          key={provider.name}
          interactionType={InteractionType.LOG_IN}
          label={`Log in with ${provider.name.split(' ')[0]}`}
          onClick={() => signIn(provider.id)}
        />
      </Grid>
    </Grid>
  );
}
