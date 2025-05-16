import { graphql } from '@/types/graphql';

import { CollaborationQuestionFragment } from './collaborationQuestions/queries';
import { ProjectUpdateFragment } from './updates/queries';
import { OpportunityFragment } from './opportunities/queries';
import { SurveyQuestionFragment } from './surveyQuestions/queries';
import { InnoUserFragment } from './innoUsers/queries';
import { EventFragment } from './events/queries';

export const GetProjectData = graphql(
  `
    query GetProjectData($projectId: ID!, $now: DateTime) {
      collaborationQuestions(filters: { project: { documentId: { eq: $projectId } } }) {
        ...CollaborationQuestion
      }
      updates(filters: { project: { documentId: { eq: $projectId } } }) {
        ...ProjectUpdate
      }
      opportunities(filters: { project: { documentId: { eq: $projectId } } }) {
        ...Opportunity
      }
      surveyQuestions(filters: { project: { documentId: { eq: $projectId } } }) {
        ...SurveyQuestion
      }
      questions(filters: { project: { documentId: { eq: $projectId } } }) {
        documentId
        title
        authors {
          ...InnoUser
        }
        updatedAt
      }
      futureEvents: events(
        filters: { project: { documentId: { eq: $projectId } }, startTime: { gte: $now } }
        pagination: { page: 2, pageSize: 1 }
      ) {
        ...Event
      }
      pastEvents: events(
        filters: { project: { documentId: { eq: $projectId } }, startTime: { lt: $now } }
        pagination: { page: 2, pageSize: 1 }
      ) {
        ...Event
      }
    }
  `,
  [
    CollaborationQuestionFragment,
    ProjectUpdateFragment,
    OpportunityFragment,
    SurveyQuestionFragment,
    InnoUserFragment,
    EventFragment,
  ],
);
