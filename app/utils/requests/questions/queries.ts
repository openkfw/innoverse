import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const GetQuestionsByProjectIdQuery = graphql(
  `
    query GetQuestions($projectId: ID) {
      questions(filters: { project: { id: { eq: $projectId } } }) {
        data {
          id
          attributes {
            title
            authors {
              data {
                ...InnoUser
              }
            }
            updatedAt
          }
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
        data {
          id
          attributes {
            title
            authors {
              data {
                ...InnoUser
              }
            }
          }
        }
      }
    }
  `,
  [InnoUserFragment],
);
