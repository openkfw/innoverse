import { graphql } from '@/types/graphql';
import { InnoUserFragment } from './queries';

export const CreateInnoUserMutation = graphql(`
  mutation PostInnoUser(
    $providerId: String
    $provider: String
    $name: String!
    $username: String
    $role: String
    $department: String
    $email: String
    $avatarId: ID
  ) {
    createInnoUser(
      data: {
        providerId: $providerId
        provider: $provider
        name: $name
        username: $username
        role: $role
        department: $department
        email: $email
        avatar: $avatarId
      }
    ) {
      data {
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
              }
            }
          }
        }
      }
    }
  }
`);

export const UpdateInnoUserMutation = graphql(
  `
    mutation PostInnoUser(
      $id: ID!
      $providerId: String
      $provider: String
      $name: String!
      $role: String
      $department: String
      $email: String
      $avatarId: ID
    ) {
      updateInnoUser(
        id: $id
        data: {
          providerId: $providerId
          provider: $provider
          name: $name
          role: $role
          department: $department
          email: $email
          avatar: $avatarId
        }
      ) {
        data {
          ...InnoUser
        }
      }
    }
  `,
  [InnoUserFragment],
);

export const CreateOpportunityParticipantMutation = graphql(`
  mutation PostInnoUser(
    $providerId: String
    $provider: String
    $name: String!
    $username: String
    $role: String
    $department: String
    $email: String
    $avatarId: ID
  ) {
    createInnoUser(
      data: {
        providerId: $providerId
        provider: $provider
        name: $name
        username: $username
        role: $role
        department: $department
        email: $email
        avatar: $avatarId
      }
    ) {
      data {
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
              }
            }
          }
        }
      }
    }
  }
`);

export const UpdateInnoUserUsernameMutation = graphql(`
  mutation UpdateInnoUser($id: ID!, $username: String!) {
    updateInnoUser(id: $id, data: { username: $username }) {
      data {
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
              }
            }
          }
        }
      }
    }
  }
`);
