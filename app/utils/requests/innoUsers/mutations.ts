import { graphql } from '@/types/graphql';

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
