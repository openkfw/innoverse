import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const ProjectUpdateFragment = graphql(
  `
    fragment ProjectUpdate on UpdateEntity @_unmask {
      id
      attributes {
        comment
        topic
        updatedAt
        linkToCollaborationTab
        anonymous
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
      }
    }
  `,
  [InnoUserFragment],
);

export const GetUpdatesQuery = graphql(
  `
    query GetUpdates($limit: Int) {
      updates(sort: "updatedAt:desc", pagination: { limit: $limit }) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const GetUpdateByIdQuery = graphql(
  `
    query GetUpdateById($id: ID!) {
      update(id: $id) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const GetUpdatesByProjectIdQuery = graphql(
  `
    query GetUpdates($projectId: ID, $sort: String! = "updatedAt:desc") {
      updates(sort: [$sort], filters: { project: { id: { eq: $projectId } } }) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const GetUpdatesByIdsQuery = graphql(
  `
    query GetUpdates($ids: [ID], $sort: String! = "updatedAt:desc") {
      updates(sort: [$sort], filters: { id: { in: $ids } }) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const GetUpdatesPageByProjectsTitlesAndTopicsQuery = graphql(
  `
    query GetUpdatesByProjectTitleAndTopics(
      $projectTitles: [String]
      $topics: [String]
      $page: Int
      $pageSize: Int
      $sort: String!
    ) {
      updates(
        filters: { project: { title: { in: $projectTitles } }, and: { topic: { in: $topics } } }
        pagination: { page: $page, pageSize: $pageSize }
        sort: [$sort]
      ) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const GetUpdatesPageByProjectTitlesQuery = graphql(
  `
    query GetUpdatesByProjectTitles($projectTitles: [String], $page: Int, $pageSize: Int, $sort: String!) {
      updates(
        filters: { project: { title: { in: $projectTitles } } }
        pagination: { page: $page, pageSize: $pageSize }
        sort: [$sort]
      ) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const GetUpdatesPageByTopicsQuery = graphql(
  `
    query GetUpdatesByTitleAndTopics($topics: [String], $page: Int, $pageSize: Int, $sort: String!) {
      updates(filters: { topic: { in: $topics } }, pagination: { page: $page, pageSize: $pageSize }, sort: [$sort]) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const GetUpdatesPageQuery = graphql(
  `
    query GetUpdates($page: Int, $pageSize: Int, $sort: String!) {
      updates(pagination: { page: $page, pageSize: $pageSize }, sort: [$sort]) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);

export const GetUpdateCountQuery = graphql(`
  query getUpdateCount($projectId: ID!) {
    updates(filters: { project: { id: { eq: $projectId } } }) {
      meta {
        pagination {
          total
        }
      }
    }
  }
`);

export const GetUpdatesStartingFromQuery = graphql(
  `
    query GetUpdatesStartingFrom($from: DateTime, $page: Int, $pageSize: Int) {
      updates(
        filters: { or: [{ updatedAt: { gte: $from } }, { createdAt: { gte: $from } }] }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        data {
          ...ProjectUpdate
        }
      }
    }
  `,
  [ProjectUpdateFragment],
);
