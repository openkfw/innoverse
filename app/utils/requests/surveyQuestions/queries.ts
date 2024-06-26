import { graphql } from '@/types/graphql';

export const SurveyQuestionFragment = graphql(`
  fragment SurveyQuestion on SurveyQuestionEntity @_unmask {
    id
    attributes {
      question
      updatedAt
      createdAt
      responseOptions {
        responseOption
      }
      project {
        data {
          id
          attributes {
            title
          }
        }
      }
    }
  }
`);

export const GetSurveyQuestionByIdQuery = graphql(`
  query GetSurveyQuestionById($id: ID) {
    surveyQuestion(id: $id) {
      data {
        id
        attributes {
          question
          updatedAt
          createdAt
          responseOptions {
            responseOption
          }
          project {
            data {
              id
              attributes {
                title
              }
            }
          }
        }
      }
    }
  }
`);

export const GetSurveyQuestionsByProjectIdQuery = graphql(`
  query GetSurveyQuestions($projectId: ID) {
    surveyQuestions(filters: { project: { id: { eq: $projectId } } }) {
      data {
        id
        attributes {
          updatedAt
          question
          updatedAt
          createdAt
          responseOptions {
            responseOption
          }
          project {
            data {
              id
              attributes {
                title
              }
            }
          }
        }
      }
    }
  }
`);

export const GetSurveyQuestionsCountByProjectIdQuery = graphql(`
  query GetSurveyQuestions($projectId: ID) {
    surveyQuestions(filters: { project: { id: { eq: $projectId } } }) {
      meta {
        pagination {
          total
        }
      }
    }
  }
`);

export const GetUpdatedSurveysQuery = graphql(`
  query GetUpdatedSurveys($from: DateTime) {
    surveyQuestions(filters: { createdAt: { gte: $from }, or: { updatedAt: { gte: $from } } }) {
      data {
        id
        attributes {
          question
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

export const GetSurveysStartingFromQuery = graphql(
  `
    query GetSurveyQuestions($from: DateTime, $page: Int, $pageSize: Int) {
      surveyQuestions(
        filters: { or: [{ updatedAt: { gte: $from } }, { createdAt: { gte: $from } }] }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        data {
          ...SurveyQuestion
        }
      }
    }
  `,
  [SurveyQuestionFragment],
);
