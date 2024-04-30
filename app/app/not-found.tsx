import React from 'react';
import Link from 'next/link';

import Typography from '@mui/material/Typography';

import Error from '../components/error/Error';

const NotFoundPage = () => {
  return (
    <Error
      status={404}
      text="Die Seite wurde nicht gefunden"
      body={
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Typography color="common.white" sx={linkStyles}>
            Zur Startseite
          </Typography>
        </Link>
      }
    />
  );
};

const linkStyles = {
  opacity: 0.8,
  ':hover': {
    color: 'secondary.main',
  },
};

export default NotFoundPage;
