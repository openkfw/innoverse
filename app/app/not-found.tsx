import React from 'react';
import Link from 'next/link';

import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';

import Error from '../components/error/Error';

const NotFoundPage = () => {
  return (
    <Error
      status={404}
      text={m.app_notFound_errorMessage()}
      body={
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Typography color="common.white" sx={linkStyles}>
            {m.app_notFound_homepageLink()}
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
