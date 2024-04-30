import React from 'react';

import Error from './Error';

interface ErrorPageProps {
  message?: string;
}

const ErrorPage = (props: ErrorPageProps) => {
  const { message } = props;
  return (
    <Error text={message ? message : 'Die Daten konnten nicht geladen werden.' + 'Versuchen Sie es später erneut.'} />
  );
};

export default ErrorPage;
