'use client';

import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import InteractionButton, { InteractionType } from './InteractionButton';

export default function SignInOptions() {
  const [signInProviders, setSignInProviders] = useState<any>();

  useEffect(() => {
    async function getSignInProviders() {
      setSignInProviders(await getProviders());
    }
    getSignInProviders();
  }, []);

  return (
    <>
      {signInProviders &&
        Object.values(signInProviders).map((provider: any) => (
          <>
            <Grid container justifyItems="space-between">
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
              <Grid item container xs={7} justifyContent="flex-end" alignContent="center">
                <InteractionButton
                  key={provider.name}
                  interactionType={InteractionType.LOG_IN}
                  label={`Log in with ${provider.name.split(' ')[0]}`}
                  onClick={() => signIn(provider.id)}
                />
              </Grid>
            </Grid>
          </>
        ))}
    </>
  );
}
