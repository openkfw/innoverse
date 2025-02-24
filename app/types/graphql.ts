import { initGraphQLTada } from 'gql.tada';

import { introspection } from '@/types/strapi-graphql-env';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: Date | string;
    Date: Date;
  };
}>();
