import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';
import { ProjectFragment } from '../project/queries';

export const ProjectQuestionFragment = graphql(
  `
    fragment Question on Question @_unmask {
      documentId
      title
      authors {
        ...InnoUser
      }
      createdAt
      updatedAt
      project {
        ...Project
      }
    }
  `,
  [InnoUserFragment, ProjectFragment],
);

export const GetQuestionsByProjectIdQuery = graphql(
  `
    query GetQuestions($projectId: ID) {
      questions(filters: { project: { documentId: { eq: $projectId } } }) {
        documentId
        title
        authors {
          ...InnoUser
        }
        updatedAt
      }
    }
  `,
  [InnoUserFragment],
);

export const GetUpdatedQuestionsQuery = graphql(
  `
    query GetUpdatedQuestions($from: DateTime) {
      questions(filters: { or: [{ updatedAt: { gte: $from } }, { createdAt: { gte: $from } }] }) {
        documentId
        title
        authors {
          ...InnoUser
        }
      }
    }
  `,
  [InnoUserFragment],
);
