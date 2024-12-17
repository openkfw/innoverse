import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const GetQuestionsByProjectIdQuery = graphql(
  `
    query GetQuestions($projectId: ID) {
      questions(filters: { project: { documentId: { eq: $projectId } } }) {
        nodes {
          documentId
          title
          authors {
            ...InnoUser
          }
          updatedAt
        }
      }
    }
  `,
  [InnoUserFragment],
);

export const GetUpdatedQuestionsQuery = graphql(
  `
    query GetUpdatedQuestions($from: DateTime) {
      questions(filters: { or: [{ updatedAt: { gte: $from } }, { createdAt: { gte: $from } }] }) {
        nodes {
          documentId
          title
          authors {
            ...InnoUser
          }
        }
      }
    }
  `,
  [InnoUserFragment],
);
