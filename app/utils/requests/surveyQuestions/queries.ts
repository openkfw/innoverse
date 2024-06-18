import { graphql } from '@/types/graphql';

export const SurveyQuestionFragment = graphql(`
  fragment SurveyQuestion on SurveyQuestionEntity @_unmask {
    id
    attributes {
      question
      updatedAt
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
