import React from 'react';

import Layout from '../layout/Layout';

import Error from './Error';

const ErrorPage = () => {
  return (
    <Layout>
      <Error text="Die Daten konnten nicht geladen werden. Versuchen Sie es später erneut." />
    </Layout>
  );
};

export default ErrorPage;
