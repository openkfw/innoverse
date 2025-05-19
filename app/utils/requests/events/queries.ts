import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const EventFragment = graphql(
  `
    fragment Event on Event @_unmask {
      documentId
      updatedAt
      title
      startTime
      endTime
      type
      description
      location
      author {
        ...InnoUser
      }
      project {
        documentId
        title
      }
      Themes {
        theme
      }
      image {
        url
        formats
      }
    }
  `,
  [InnoUserFragment],
);

export const GetEventByIdQuery = graphql(
  `
    query GetEventById($id: ID!) {
      event(documentId: $id) {
        ...Event
      }
    }
  `,
  [EventFragment],
);

export const GetEventsPageQuery = graphql(
  `
    query getEvents($projectId: ID!, $page: Int, $pageSize: Int) {
      events(
        filters: { project: { documentId: { eq: $projectId } } }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        ...Event
      }
    }
  `,
  [EventFragment],
);

export const GetPastEventsPageQuery = graphql(
  `
    query getPastEvents($projectId: ID!, $now: DateTime, $page: Int, $pageSize: Int) {
      events(
        filters: { project: { documentId: { eq: $projectId } }, startTime: { lt: $now } }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        ...Event
      }
    }
  `,
  [EventFragment],
);

export const GetFutureEventsPageQuery = graphql(
  `
    query getFutureEvents($projectId: ID!, $now: DateTime, $page: Int, $pageSize: Int) {
      events(
        filters: { project: { documentId: { eq: $projectId } }, startTime: { gte: $now } }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        ...Event
      }
    }
  `,
  [EventFragment],
);

export const GetEventsStartingFromQuery = graphql(
  `
    query GetUpdatedEvents($from: DateTime, $page: Int, $pageSize: Int) {
      events(
        filters: { or: [{ updatedAt: { gte: $from } }, { createdAt: { gte: $from } }] }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        ...Event
      }
    }
  `,
  [EventFragment],
);
