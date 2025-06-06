import { graphql } from '@/types/graphql';
import { ProjectUpdateFragment } from '@/utils/requests/updates/queries';
import { EventFragment } from '@/utils/requests/events/queries';
import { SurveyQuestionFragment } from '@/utils/requests/surveyQuestions/queries';
import { CollaborationQuestionFragment } from '@/utils/requests/collaborationQuestions/queries';

export const GetLatestNewsQuery = graphql(
  `
    query GetNews($after: DateTime, $limit: Int) {
      updates(sort: "updatedAt:desc", filters: { updatedAt: { gte: $after } }, pagination: { limit: $limit }) {
        ...ProjectUpdate
      }
      events(sort: "updatedAt:desc", filters: { updatedAt: { gte: $after } }, pagination: { limit: $limit }) {
        ...Event
      }
      surveyQuestions(sort: "updatedAt:desc", filters: { updatedAt: { gte: $after } }, pagination: { limit: $limit }) {
        ...SurveyQuestion
      }
      collaborationQuestions(
        sort: "updatedAt:desc"
        filters: { updatedAt: { gte: $after } }
        pagination: { limit: $limit }
      ) {
        ...CollaborationQuestion
      }
    }
  `,
  [ProjectUpdateFragment, EventFragment, SurveyQuestionFragment, CollaborationQuestionFragment],
);
