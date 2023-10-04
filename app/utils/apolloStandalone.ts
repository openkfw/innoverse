// TODO: At the moment this component is only used for ISR but we might reuse this also on the client.
// TODO: Check cache sizes

export async function getStandaloneApolloClient() {
  //TODO make singelton out of this
  const { ApolloClient, InMemoryCache, HttpLink } = await import('@apollo/client');
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT,
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
