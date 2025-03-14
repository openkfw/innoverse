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
      documentId
      providerId
      provider
      name
      role
      department
      email
      username
      avatar {
        formats
        url
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
      documentId
      providerId
      provider
      name
      role
      department
      email
      avatar {
        url
      }
    }
  }
`);

export const UpdateInnoUserUsernameMutation = graphql(`
  mutation UpdateInnoUser($id: ID!, $username: String!) {
    updateInnoUser(documentId: $id, data: { username: $username }) {
      documentId
      providerId
      provider
      name
      username
      role
      department
      email
      avatar {
        formats
        url
      }
    }
  }
`);
