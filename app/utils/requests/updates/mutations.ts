import { graphql } from '@/types/graphql';
import { ProjectUpdateFragment } from '@/utils/requests/updates/queries';

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
