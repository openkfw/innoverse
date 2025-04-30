import { graphql } from '@/types/graphql';

export const cacheUpdatePermissionForUser = graphql(`
  query getCacheUpdatePermissionForUser($providerId: String!) {
    userPermission {
      cacheUpdatePermissions(filters: { providerId: { eq: $providerId } }) {
        documentId
        providerId
        username
      }
    }
  }
`);
