'use server';
import { TadaDocumentNode } from 'gql.tada';
import { DocumentNode, GraphQLError, Kind, OperationDefinitionNode, print } from 'graphql';
import { StatusCodes } from 'http-status-codes';

import { clientConfig } from '@/config/client';
import { serverConfig } from '@/config/server';
import { RequestError, StrapiRequestError } from '@/entities/error';

const strapiGraphQLFetcher = async <Result, Variables = {}>(
  graphqlQuery: TadaDocumentNode<Result, Variables>,
  variables?: Variables,
): Promise<Result> => {
  const operationName = getOperationName(graphqlQuery);

  const response = await fetch(clientConfig.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serverConfig.STRAPI_TOKEN}`,
      ...(operationName ? { 'graphql-operation-name': operationName } : {}),
    },
    body: JSON.stringify({
      query: print(graphqlQuery),
      variables,
    }),
  });

  // Ensure response has json content-type
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.indexOf('application/json') < 0) {
    throw new Error(
      `Response content type is not 'application/json', but '${contentType}'. This could be due to the request being blocked and redirected e.g. by a WAF`,
    );
  }

  const result = await response.json();

  if (result.error) {
    const error: RequestError = {
      name: 'StrapiRequestError',
      message: 'A request to the GraphQL endpoint returned with an error:\n' + result.error.message,
      info: mapError(result),
      status: result.error.status,
      stack: JSON.stringify([result]),
    };

    throw error;
  }

  if (result.errors) {
    const errors: GraphQLError[] = result.errors;
    const messages = errors.map((error) => error.message).join('\n');

    const error: RequestError = {
      name: 'StrapiRequestError',
      message: 'A request to the GraphQL endpoint returned with errors:\n' + messages,
      info: messages,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      stack: JSON.stringify(errors),
    };

    throw error;
  }

  if (!result.data) throw new Error('JSON response contained no data');
  return result.data;
};

const mapError = (parsedError: StrapiRequestError) => {
  switch (parsedError.error.status) {
    case StatusCodes.UNAUTHORIZED:
      return 'Got: UNAUTHORIZED from Strapi. Probably the STRAPI_TOKEN is not set correctly';
    case StatusCodes.NOT_FOUND:
      return 'Got: NOT_FOUND from Strapi. Probably the NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT is not set correctly';
    default:
      return `Unknown error returned by Strapi. HTTP error code: ${parsedError.error.status}`;
  }
};

const getOperationName = (graphqlQuery: DocumentNode) => {
  const operationDefinition = graphqlQuery.definitions.find(
    (definition): definition is OperationDefinitionNode => definition.kind === Kind.OPERATION_DEFINITION,
  );
  const operationName = operationDefinition?.name?.value;
  return operationName;
};

export default strapiGraphQLFetcher;
