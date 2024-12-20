import { graphql } from '@/types/graphql';

export const InnoUserFragment = graphql(`
  fragment InnoUser on InnoUserEntity @_unmask {
    documentId
    providerId
    provider
    name
    role
    department
    email
    avatar {
      url
      formats
    }
  }
`);

export const GetInnoUserByEmailQuery = graphql(
  `
    query GetInnoUser($email: String) {
      innoUsers(filters: { email: { eq: $email } }) {
        nodes {
          ...InnoUser
        }
      }
    }
  `,
  [InnoUserFragment],
);

export const GetInnoUserByProviderIdQuery = graphql(
  `
    query GetInnoUser($providerId: String) {
      innoUsers(filters: { providerId: { eq: $providerId } }) {
        nodes {
          ...InnoUser
        }
      }
    }
  `,
  [InnoUserFragment],
);
