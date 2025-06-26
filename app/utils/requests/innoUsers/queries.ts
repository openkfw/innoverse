import { graphql } from '@/types/graphql';

export const InnoUserFragment = graphql(`
  fragment InnoUser on InnoUser @_unmask {
    documentId
    providerId
    provider
    name
    username
    role
    department
    email
    avatar {
      id
      documentId
      url
      formats
    }
  }
`);

export const GetInnoUserByEmailQuery = graphql(
  `
    query GetInnoUser($email: String) {
      innoUsers(filters: { email: { eq: $email } }) {
        ...InnoUser
      }
    }
  `,
  [InnoUserFragment],
);

export const GetInnoUserByProviderIdQuery = graphql(
  `
    query GetInnoUser($providerId: String) {
      innoUsers(filters: { providerId: { eq: $providerId } }) {
        ...InnoUser
      }
    }
  `,
  [InnoUserFragment],
);

export const GetInnoUsersByProviderIdsQuery = graphql(
  `
    query GetInnoUsers($providerIds: [String!]) {
      innoUsers(filters: { providerId: { in: $providerIds } }) {
        ...InnoUser
      }
    }
  `,
  [InnoUserFragment],
);

export const GetInnoUsersByIdsQuery = graphql(
  `
    query GetInnoUsers($ids: [ID!]) {
      innoUsers(filters: { documentId: { in: $ids } }) {
        ...InnoUser
      }
    }
  `,
  [InnoUserFragment],
);

export const GetAllInnoUsers = graphql(
  `
    query GetInnoUsers($limit: Int) {
      innoUsers(pagination: { limit: $limit }) {
        ...InnoUser
      }
    }
  `,
  [InnoUserFragment],
);

export const GetEmailsByUsernamesQuery = graphql(`
  query GetEmailsByUsernames($usernames: [String!]) {
    innoUsers(filters: { username: { in: $usernames } }) {
      email
    }
  }
`);

export const GetInnoUserByUsernameQuery = graphql(
  `
    query GetInnoUserByUsername($username: String!) {
      innoUsers(filters: { username: { eq: $username } }) {
        ...InnoUser
      }
    }
  `,
  [InnoUserFragment],
);
