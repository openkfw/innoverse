import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const CollaborationQuestionFragment = graphql(
  `
    fragment CollaborationQuestion on CollaborationQuestionEntity @_unmask {
      id
      attributes {
        updatedAt
        project {
          data {
            id
            attributes {
              title
            }
          }
        }
        title
        isPlatformFeedback
        description
        updatedAt
        authors {
          data {
            ...InnoUser
          }
        }
      }
    }
  `,
  [InnoUserFragment],
);

export const GetCollaborationQuestionByIdQuery = graphql(
  `
    query GetCollaborationQuestionById($id: ID) {
      collaborationQuestion(id: $id) {
        data {
          ...CollaborationQuestion
        }
      }
    }
  `,
  [CollaborationQuestionFragment],
);

export const GetCollaborationQuestionsByProjectIdQuery = graphql(
  `
    query GetCollaborationQuestions($projectId: ID) {
      collaborationQuestions(filters: { project: { id: { eq: $projectId } } }) {
        data {
          ...CollaborationQuestion
        }
      }
    }
  `,
  [CollaborationQuestionFragment],
);

export const GetPlatformFeedbackCollaborationQuestion = graphql(`
  query GetPlatformFeedbackCollaborationQuestion {
    collaborationQuestions(filters: { isPlatformFeedback: { eq: true } }) {
      data {
        id
        attributes {
          project {
            data {
              id
            }
          }
        }
      }
    }
  }
`);

export const GetCollaborationQuestionsCountProjectIdQuery = graphql(`
  query GetCollaborationQuestions($projectId: ID) {
    collaborationQuestions(filters: { project: { id: { eq: $projectId } } }) {
      meta {
        pagination {
          total
        }
      }
    }
  }
`);

export const GetCollaborationQuestsionsStartingFromQuery = graphql(
  `
    query GetUpdatedCollaborationQuestions($from: DateTime, $page: Int, $pageSize: Int) {
      collaborationQuestions(
        filters: { or: [{ updatedAt: { gte: $from } }, { createdAt: { gte: $from } }] }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        data {
          ...CollaborationQuestion
        }
      }
    }
  `,
  [CollaborationQuestionFragment],
);
