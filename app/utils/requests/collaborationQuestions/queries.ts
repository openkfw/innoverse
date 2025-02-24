import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const CollaborationQuestionFragment = graphql(
  `
    fragment CollaborationQuestion on CollaborationQuestion @_unmask {
      documentId
      updatedAt
      project {
        documentId
        title
      }
      title
      isPlatformFeedback
      description
      updatedAt
      authors {
        ...InnoUser
      }
    }
  `,
  [InnoUserFragment],
);

export const GetCollaborationQuestionByIdQuery = graphql(
  `
    query GetCollaborationQuestionById($documentId: ID!) {
      collaborationQuestion(documentId: $documentId) {
        ...CollaborationQuestion
      }
    }
  `,
  [CollaborationQuestionFragment],
);

export const GetCollaborationQuestionsByProjectIdQuery = graphql(
  `
    query GetCollaborationQuestions($projectId: ID) {
      collaborationQuestions(filters: { project: { documentId: { eq: $projectId } } }) {
        ...CollaborationQuestion
      }
    }
  `,
  [CollaborationQuestionFragment],
);

export const GetPlatformFeedbackCollaborationQuestion = graphql(`
  query GetPlatformFeedbackCollaborationQuestion {
    collaborationQuestions(filters: { isPlatformFeedback: { eq: true } }) {
      documentId
      project {
        documentId
      }
    }
  }
`);

export const GetCollaborationQuestionsCountProjectIdQuery = graphql(`
  query GetCollaborationQuestions($projectId: ID) {
    collaborationQuestions_connection(filters: { project: { documentId: { eq: $projectId } } }) {
      pageInfo {
        total
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
        ...CollaborationQuestion
      }
    }
  `,
  [CollaborationQuestionFragment],
);
