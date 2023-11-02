// TODO: At the moment this component is only used for ISR but we might reuse this also on the client.
// TODO: Check cache sizes

import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

let client: ApolloClient<NormalizedCacheObject> | undefined = undefined;

export async function getStandaloneApolloClient() {
  if (!client)
    client = new ApolloClient({
      link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT,
      }),
      cache: new InMemoryCache(),
    });
  return client;
}
