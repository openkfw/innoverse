import { graphql } from '@/types/graphql';
import { ProjectUpdateFragment } from '@/utils/requests/updates/queries';

export const DeleteProjectUpdateMutation = graphql(
  `
    mutation DeleteProjectUpdate($updateId: ID!) {
      deleteUpdate(id: $updateId) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const CreateProjectUpdateMutation = graphql(
  `
    mutation PostProjectUpdate($projectId: ID!, $comment: String, $authorId: ID!, $linkToCollaborationTab: Boolean) {
      createUpdate(
        data: {
          project: $projectId
          comment: $comment
          author: $authorId
          linkToCollaborationTab: $linkToCollaborationTab
        }
      ) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const UpdateProjectUpdateMutation = graphql(
  `
    mutation UpdateProjectUpdate($updateId: ID!, $comment: String) {
      updateUpdate(id: $updateId, data: { comment: $comment }) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);
