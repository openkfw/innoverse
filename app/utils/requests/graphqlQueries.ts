import { graphql } from '@/types/graphql';

import { CollaborationQuestionFragment } from './collaborationQuestions/queries';
import { ProjectUpdateFragment } from './updates/queries';
import { OpportunityFragment } from './opportunities/queries';
import { SurveyQuestionFragment } from './surveyQuestions/queries';
import { InnoUserFragment } from './innoUsers/queries';
import { EventFragment } from './events/queries';
import { ProjectFragment } from './project/queries';
import { ProjectQuestionFragment } from './questions/queries';

export const GetProjectData = graphql(
  `
    query GetProjectData($projectId: ID!, $now: DateTime, $sort: String! = "createdAt:desc") {
      collaborationQuestions(filters: { project: { documentId: { eq: $projectId } } }) {
        ...CollaborationQuestion
      }
      updates(filters: { project: { documentId: { eq: $projectId } } }, sort: [$sort]) {
        ...ProjectUpdate
      }
      opportunities(filters: { project: { documentId: { eq: $projectId } } }) {
        ...Opportunity
      }
      surveyQuestions(filters: { project: { documentId: { eq: $projectId } } }) {
        ...SurveyQuestion
      }
      questions(filters: { project: { documentId: { eq: $projectId } } }) {
        ...Question
      }
      futureEvents: events(filters: { project: { documentId: { eq: $projectId } }, startTime: { gte: $now } }) {
        ...Event
      }
      pastEvents: events(filters: { project: { documentId: { eq: $projectId } }, startTime: { lt: $now } }) {
        ...Event
      }
    }
  `,
  [
    CollaborationQuestionFragment,
    ProjectUpdateFragment,
    OpportunityFragment,
    SurveyQuestionFragment,
    ProjectQuestionFragment,
    InnoUserFragment,
    EventFragment,
  ],
);

export const GetCountsForProject = graphql(
  `
    query getCountsProject($projectId: ID!, $now: DateTime) {
      events_connection(filters: { project: { documentId: { eq: $projectId } }, startTime: { gte: $now } }) {
        pageInfo {
          total
        }
      }
      updates_connection(filters: { project: { documentId: { eq: $projectId } } }) {
        pageInfo {
          total
        }
      }
      opportunities_connection(filters: { project: { documentId: { eq: $projectId } } }) {
        pageInfo {
          total
        }
      }
      collaborationQuestions_connection(filters: { project: { documentId: { eq: $projectId } } }) {
        pageInfo {
          total
        }
      }
      surveyQuestions_connection(filters: { project: { documentId: { eq: $projectId } } }) {
        pageInfo {
          total
        }
      }
    }
  `,
  [],
);

export const GetMainPageData = graphql(
  `
    query getMainPageData($now: DateTime, $updatesLimit: Int, $sort: String! = "updatedAt:desc") {
      projects(sort: [$sort]) {
        ...Project
      }
      featuredProjects: projects(filters: { featured: { eq: true } }, sort: [$sort]) {
        ...Project
      }
      futureEvents: events(filters: { startTime: { gte: $now } }, sort: "startTime:asc") {
        ...Event
      }
      updates(sort: "updatedAt:desc", pagination: { limit: $updatesLimit }) {
        ...ProjectUpdate
      }
    }
  `,
  [ProjectFragment, EventFragment, ProjectUpdateFragment],
);
