'use server';
import { ResultOf, VariablesOf } from 'gql.tada';
import { DocumentNode, Kind, OperationDefinitionNode, print } from 'graphql';

import { RequestError } from '@/entities/error';

const strapiGraphQLFetcher = async <TQuery extends DocumentNode>(
  graphqlQuery: TQuery,
  variables?: VariablesOf<TQuery>,
) => {
  const queryString = print(graphqlQuery);
  const operationName = getOperationName(graphqlQuery);
  const response = await strapiFetcher(queryString, variables, operationName);
  const typedResult = response as { data?: ResultOf<TQuery> };
  if (!typedResult.data) throw new Error('JSON response contained no data');
  return typedResult.data;
};

const getOperationName = (graphqlQuery: DocumentNode) => {
  const operationDefinition = graphqlQuery.definitions.find(
    (definition): definition is OperationDefinitionNode => definition.kind === Kind.OPERATION_DEFINITION,
  );
  const operationName = operationDefinition?.name?.value;
  return operationName;
};

const strapiFetcher = async (query: unknown, variables?: unknown, operationName?: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      ...(operationName ? { 'graphql-operation-name': operationName } : {}),
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
    next: { revalidate: 0 },
  });

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const parsedError: RequestError = await res.json();
    const error: any = new Error('An error occurred while fetching the data.');

    // Attach extra info to the error object.

    error.info = parsedError.info || 'An error occurred while fetching the data.';
    error.status = parsedError.status || res.status;
    error.errors = parsedError.errors;

    throw error;
  }

  // Ensure response has json content-type
  const contentType = res.headers.get('content-type') ?? '';

  if (contentType.indexOf('application/json') < 0) {
    throw new Error(
      `Response content type is not 'application/json', but '${contentType}'. This could be due to the request being blocked and redirected e.g. by a WAF`,
    );
  }

  return await res.json();
};

export default strapiGraphQLFetcher;
