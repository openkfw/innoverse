import { graphql } from '@/types/graphql';

export const InnoUserFragment = graphql(`
  fragment InnoUser on InnoUserEntity @_unmask {
    id
    attributes {
      providerId
      provider
      name
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

// todo: attributes.name->attributes.username
export const GetAllInnoUsers = graphql(`
  query GetInnoUsers($limit: Int) {
    innoUsers(pagination: { limit: $limit }) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`);
