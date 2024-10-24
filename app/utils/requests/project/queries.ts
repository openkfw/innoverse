import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const ProjectFragment = graphql(
  `
    fragment Project on ProjectEntity @_unmask {
      id
      attributes {
        title
        shortTitle
        summary
        status
        featured
        projectStart
        updatedAt
        image {
          data {
            attributes {
              url
              formats
            }
          }
        }
        team {
          data {
            ...InnoUser
          }
        }
        author {
          data {
            ...InnoUser
          }
        }
        description {
          text
          tags {
            tag
          }
        }
      }
    }
  `,
  [InnoUserFragment],
);

export const GetProjectsQuery = graphql(
  `
    query GetProjects($limit: Int, $sort: String! = "updatedAt:desc") {
      projects(pagination: { limit: $limit }, sort: [$sort]) {
        data {
          ...Project
        }
      }
    }
  `,
  [ProjectFragment],
);

export const GetProjectsBySearchStringQuery = graphql(
  `
    query GetProjects($page: Int, $pageSize: Int, $sort: String! = "updatedAt:desc", $searchString: String! = "") {
      projects(
        filters: {
          or: [
            { title: { containsi: $searchString } }
            { shortTitle: { containsi: $searchString } }
            { summary: { containsi: $searchString } }
            { author: { name: { containsi: $searchString } } }
            { team: { name: { containsi: $searchString } } }
            { description: { text: { containsi: $searchString } } }
            { description: { tags: { tag: { containsi: $searchString } } } }
            { status: { containsi: $searchString } }
          ]
        }
        pagination: { page: $page, pageSize: $pageSize }
        sort: [$sort]
      ) {
        data {
          ...Project
        }
      }
    }
  `,
  [ProjectFragment],
);

export const GetProjectByIdQuery = graphql(
  `
    query GetProjectById($id: ID!) {
      project(id: $id) {
        data {
          ...Project
        }
      }
    }
  `,
  [ProjectFragment],
);

export const GetProjectTitleByIdQuery = graphql(`
  query GetProjectTitleById($id: ID!) {
    project(id: $id) {
      data {
        id
        attributes {
          title
        }
      }
    }
  }
`);

export const GetProjectTitleByIdsQuery = graphql(`
  query GetProjectTitlesByIds($ids: [ID!], $page: Int, $pageSize: Int) {
    projects(filters: { id: { in: $ids } }, pagination: { page: $page, pageSize: $pageSize }) {
      data {
        id
        attributes {
          title
        }
      }
    }
  }
`);

export const GetProjectsPageQuery = graphql(
  `
    query GetProjectsPage($page: Int, $pageSize: Int) {
      projects(pagination: { page: $page, pageSize: $pageSize }) {
        data {
          ...Project
        }
      }
    }
  `,
  [ProjectFragment],
);

export const GetProjectAuthorIdByProjectIdQuery = graphql(`
  query GetProjectAuthorIdByProjectId($projectId: ID) {
    project(id: $projectId) {
      data {
        id
        attributes {
          author {
            data {
              id
            }
          }
        }
      }
    }
  }
`);

export const GetProjectsStartingFromQuery = graphql(
  `
    query GetProjects($from: DateTime, $page: Int, $pageSize: Int) {
      projects(
        filters: { or: [{ updatedAt: { gte: $from } }, { createdAt: { gte: $from } }] }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        data {
          ...Project
        }
      }
    }
  `,
  [ProjectFragment],
);
