import React from 'react';

import * as m from '@/src/paraglide/messages.js';

import Error from './Error';

interface ErrorPageProps {
  message?: string;
}

const ErrorPage = (props: ErrorPageProps) => {
  const { message } = props;
  return <Error text={message ? message : m.components_error_errorPage_loadError()} />;
};

export default ErrorPage;
