import * as React from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { clientConfig } from '@/config/client';

export default function VersionPage() {
  return (
    <Container maxWidth="lg" sx={{ pt: 10 }}>
      <Typography variant="h4" sx={{ pb: 2 }}>
        Version Information
      </Typography>
      <p>Build timestamp: {clientConfig.NEXT_PUBLIC_BUILDTIMESTAMP}</p>
      <p>Commmit hash: {clientConfig.NEXT_PUBLIC_CI_COMMIT_SHA}</p>
    </Container>
  );
}
