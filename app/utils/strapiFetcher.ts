import { RequestError } from '../entities/error';

const strapiFetcher = async (query: string, variables?: any) => {
  const res = await fetch(process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
    next: { revalidate: 60 * 2 },
  });

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const parsedError: RequestError = await res.json();
    const error: any = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.

    error.info = parsedError.info || 'An error occurred while fetching the data.';
    error.status = parsedError.status || res.status;

    throw error;
  }

  return res.json();
};

export default strapiFetcher;
