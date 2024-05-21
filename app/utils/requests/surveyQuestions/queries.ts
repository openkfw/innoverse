import { graphql } from '@/types/graphql';

export const GetSurveyQuestionByIdQuery = graphql(`
  query GetSurveyQuestionById($id: ID) {
    surveyQuestion(id: $id) {
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

export const GetSurveyQuestionsByProjectIdQuery = graphql(`
  query GetSurveyQuestions($projectId: ID) {
    surveyQuestions(filters: { project: { id: { eq: $projectId } } }) {
      data {
        id
        attributes {
          question
          responseOptions {
            responseOption
          }
        }
      }
    }
  }
`);
