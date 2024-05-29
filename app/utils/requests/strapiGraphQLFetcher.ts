'use server';
import { ResultOf, VariablesOf } from 'gql.tada';
import { DocumentNode, Kind, OperationDefinitionNode, print } from 'graphql';

import { clientConfig } from '@/config/client';
import { serverConfig } from '@/config/server';
import { RequestError, StrapiRequestError } from '@/entities/error';
import { StatusCodes } from 'http-status-codes';

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
  const res = await fetch(clientConfig.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serverConfig.STRAPI_TOKEN}`,
      ...(operationName ? { 'graphql-operation-name': operationName } : {}),
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
    cache: 'no-store',
  });

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const parsedError: StrapiRequestError = await res.json();
    const mapError = () => {
      switch (parsedError.error.status) {
        case StatusCodes.UNAUTHORIZED:
          return 'Got: UNAUTHORIZED from Strapi. Probably the STRAPI_TOKEN is not set correctly';
        case StatusCodes.NOT_FOUND:
          return 'Got: NOT_FOUND from Strapi. Probably the NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT is not set correctly';
        default:
          return `Unknown error returned by Strapi. HTTP error code: ${parsedError.error.status}`;
      }
    };

    const error: RequestError = {
      name: 'StrapiRequestError',
      message: 'An error occurred while fetching the data.',
      info: mapError(),
      status: parsedError.error.status,
      cause: mapError(),
      stack: JSON.stringify([parsedError]),
    };

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
