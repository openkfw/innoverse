import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const EventFragment = graphql(
  `
    fragment Event on EventEntity @_unmask {
      id
      attributes {
        updatedAt
        title
        startTime
        endTime
        type
        description
        location
        author {
          data {
            ...InnoUser
          }
        }
        project {
          data {
            id
            attributes {
              title
            }
          }
        }
        Themes {
          theme
        }
        image {
          data {
            attributes {
              url
              formats
            }
          }
        }
      }
    }
  `,
  [InnoUserFragment],
);

export const GetEventByIdQuery = graphql(
  `
    query GetEventById($id: ID) {
      event(id: $id) {
        data {
          ...Event
        }
      }
    }
  `,
  [EventFragment],
);

export const GetUpcomingEventsQuery = graphql(
  `
    query GetUpcomingEvents($now: DateTime) {
      events(filters: { startTime: { gte: $now } }, sort: "startTime:asc") {
        data {
          ...Event
        }
      }
    }
  `,
  [EventFragment],
);

export const GetEventsPageQuery = graphql(
  `
    query getEvents($projectId: ID!, $page: Int, $pageSize: Int) {
      events(filters: { project: { id: { eq: $projectId } } }, pagination: { page: $page, pageSize: $pageSize }) {
        data {
          ...Event
        }
      }
    }
  `,
  [EventFragment],
);

export const GetPastEventsPageQuery = graphql(
  `
    query getPastEvents($projectId: ID!, $now: DateTime, $page: Int, $pageSize: Int) {
      events(
        filters: { project: { id: { eq: $projectId } }, startTime: { lt: $now } }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        data {
          ...Event
        }
      }
    }
  `,
  [EventFragment],
);

export const GetFutureEventsPageQuery = graphql(
  `
    query getFutureEvents($projectId: ID!, $now: DateTime, $page: Int, $pageSize: Int) {
      events(
        filters: { project: { id: { eq: $projectId } }, startTime: { gte: $now } }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        data {
          ...Event
        }
      }
    }
  `,
  [EventFragment],
);

export const GetFutureEventCountQuery = graphql(`
  query getEventCount($projectId: ID!, $now: DateTime) {
    events(filters: { project: { id: { eq: $projectId } }, startTime: { gte: $now } }) {
      meta {
        pagination {
          total
        }
      }
    }
  }
`);

export const GetEventsStartingFromQuery = graphql(
  `
    query GetUpdatedEvents($from: DateTime, $page: Int, $pageSize: Int) {
      events(
        filters: { or: [{ updatedAt: { gte: $from } }, { createdAt: { gte: $from } }] }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        data {
          ...Event
        }
      }
    }
  `,
  [EventFragment],
);
