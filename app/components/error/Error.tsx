'use client';

import React from 'react';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface ErrorProps {
  status?: number;
  text: string;
  body?: JSX.Element;
}

const defaultProps = {
  body: null,
};

const ErrorContainer = styled(Grid)({
  minHeight: '80vh',
});

const ContentContainer = styled(Grid)({
  margin: '10px',
});

const Error = (props: ErrorProps) => {
  const { status, text, body } = props;

  return (
    <ErrorContainer container item xs={12} alignItems="center" justifyContent="center" direction="column">
      {status && <Typography variant="h1">{status}</Typography>}
      <Typography variant="h6">{text}</Typography>
      <ContentContainer item>{body}</ContentContainer>
    </ErrorContainer>
  );
};

Error.defaultProps = defaultProps;

export default Error;
