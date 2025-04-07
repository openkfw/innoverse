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
      documentId
      providerId
      provider
      name
      role
      department
      email
      username
      avatar {
        id
        documentId
        formats
        url
      }
    }
  }
`);

export const UpdateInnoUserMutation = graphql(
  `
    mutation PostInnoUser($id: ID!, $role: String, $department: String, $avatarId: ID) {
      updateInnoUser(documentId: $id, data: { role: $role, department: $department, avatar: $avatarId }) {
        ...InnoUser
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
        id
        documentId
        formats
        url
      }
    }
  }
`);
