import { graphql } from '@/types/graphql';

export const cachePermissionForUser = graphql(`
  query getCachePermissionForUser($providerId: String!) {
    userPermission {
      cachePermissions(filters: { providerId: { eq: $providerId } }) {
        documentId
        providerId
        username
      }
    }
  }
`);
