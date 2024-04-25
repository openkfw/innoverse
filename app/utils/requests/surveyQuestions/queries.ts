import { graphql } from '@/types/graphql';

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
