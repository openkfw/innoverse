import { graphql } from '@/types/graphql';
import { ProjectUpdateFragment } from '@/utils/requests/updates/queries';

export const DeleteProjectUpdateMutation = graphql(
  `
    mutation DeleteProjectUpdate($updateId: ID!) {
      deleteUpdate(documentId: $updateId) {
        documentId
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const CreateProjectUpdateMutation = graphql(
  `
    mutation PostProjectUpdate(
      $projectId: ID!
      $comment: String
      $authorId: ID!
      $linkToCollaborationTab: Boolean
      $anonymous: Boolean!
    ) {
      createUpdate(
        data: {
          project: $projectId
          comment: $comment
          author: $authorId
          linkToCollaborationTab: $linkToCollaborationTab
          anonymous: $anonymous
        }
      ) {
        ...ProjectUpdate
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const UpdateProjectUpdateMutation = graphql(
  `
    mutation UpdateProjectUpdate($updateId: ID!, $comment: String) {
      updateUpdate(documentId: $updateId, data: { comment: $comment }) {
        ...ProjectUpdate
      }
    }
  `,
  [ProjectUpdateFragment],
);
