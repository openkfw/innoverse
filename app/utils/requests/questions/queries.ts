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
          }
        }
      }
    }
  `,
  [InnoUserFragment],
);
