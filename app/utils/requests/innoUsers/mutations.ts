import { graphql } from '@/types/graphql';

export const CreateInnoUserMutation = graphql(`
  mutation PostInnoUser(
    $providerId: String
    $provider: String
    $name: String!
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

export const CreateOpportunityParticipantMutation = graphql(`
  mutation PostInnoUser(
    $providerId: String
    $provider: String
    $name: String!
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
