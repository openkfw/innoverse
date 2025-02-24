import { graphql } from '@/types/graphql';

export const SurveyQuestionFragment = graphql(`
  fragment SurveyQuestion on SurveyQuestion @_unmask {
    documentId
    question
    updatedAt
    createdAt
    responseOptions {
      responseOption
    }
    project {
      documentId
      title
    }
  }
`);

export const GetSurveyQuestionByIdQuery = graphql(`
  query GetSurveyQuestionById($id: ID!) {
    surveyQuestion(documentId: $id) {
      documentId
      question
      updatedAt
      createdAt
      responseOptions {
        responseOption
      }
      project {
        documentId
        title
      }
    }
  }
`);

export const GetSurveyQuestionsByProjectIdQuery = graphql(
  `
    query GetSurveyQuestions($projectId: ID) {
      surveyQuestions(filters: { project: { documentId: { eq: $projectId } } }) {
        ...SurveyQuestion
      }
    }
  `,
  [SurveyQuestionFragment],
);

export const GetSurveyQuestionsCountByProjectIdQuery = graphql(`
  query GetSurveyQuestions($projectId: ID) {
    surveyQuestions_connection(filters: { project: { documentId: { eq: $projectId } } }) {
      pageInfo {
        total
      }
    }
  }
`);

export const GetUpdatedSurveysQuery = graphql(`
  query GetUpdatedSurveys($from: DateTime) {
    surveyQuestions(filters: { createdAt: { gte: $from }, or: { updatedAt: { gte: $from } } }) {
      documentId
      question
      project {
        documentId
      }
    }
  }
`);

export const GetSurveysStartingFromQuery = graphql(
  `
    query GetSurveyQuestions($from: DateTime, $page: Int, $pageSize: Int) {
      surveyQuestions(
        filters: { or: [{ updatedAt: { gte: $from } }, { createdAt: { gte: $from } }] }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        ...SurveyQuestion
      }
    }
  `,
  [SurveyQuestionFragment],
);
