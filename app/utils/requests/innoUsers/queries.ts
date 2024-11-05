import { graphql } from '@/types/graphql';

export const InnoUserFragment = graphql(`
  fragment InnoUser on InnoUserEntity @_unmask {
    id
    attributes {
      providerId
      provider
      name
      username
      role
      department
      email
      avatar {
        data {
          attributes {
            url
            formats
          }
        }
      }
    }
  }
`);

export const GetInnoUserByEmailQuery = graphql(
  `
    query GetInnoUser($email: String) {
      innoUsers(filters: { email: { eq: $email } }) {
        data {
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
        data {
          ...InnoUser
        }
      }
    }
  `,
  [InnoUserFragment],
);

export const GetAllInnoUsers = graphql(`
  query GetInnoUsers($limit: Int) {
    innoUsers(pagination: { limit: $limit }) {
      data {
        id
        attributes {
          username
        }
      }
    }
  }
`);

export const GetEmailsByUsernamesQuery = graphql(`
  query GetEmailsByUsernames($usernames: [String!]) {
    innoUsers(filters: { username: { in: $usernames } }) {
      data {
        attributes {
          email
        }
      }
    }
  }
`);

export const GetInnoUserByUsernameQuery = graphql(
  `
    query GetInnoUserByUsername($username: String!) {
      innoUsers(filters: { username: { eq: $username } }) {
        data {
          ...InnoUser
        }
      }
    }
  `,
  [InnoUserFragment],
);
