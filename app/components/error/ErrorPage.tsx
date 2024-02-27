import React from 'react';

import Layout from '../layout/Layout';

import Error from './Error';

interface ErrorPageProps {
  message?: string;
}

const ErrorPage = (props: ErrorPageProps) => {
  const { message } = props;
  return (
    <Layout>
      <Error text={message ? message : 'Die Daten konnten nicht geladen werden.' + 'Versuchen Sie es später erneut.'} />
    </Layout>
  );
};

export default ErrorPage;
