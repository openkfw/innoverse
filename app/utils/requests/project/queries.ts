import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const ProjectFragment = graphql(
  `
    fragment Project on ProjectEntity @_unmask {
      documentId
      title
      shortTitle
      summary
      status
      featured
      projectStart
      updatedAt
      image {
        url
        formats
      }
      team {
        ...InnoUser
      }
      author {
        ...InnoUser
      }
      description {
        text
        tags {
          tag
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
        nodes {
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
      project(documentId: $id) {
        ...Project
      }
    }
  `,
  [ProjectFragment],
);

export const GetProjectTitleByIdQuery = graphql(`
  query GetProjectTitleById($id: ID!) {
    project(documentId: $id) {
      documentId
      title
    }
  }
`);

export const GetProjectTitleByIdsQuery = graphql(`
  query GetProjectTitlesByIds($ids: [ID!], $page: Int, $pageSize: Int) {
    projects(filters: { documentId: { in: $ids } }, pagination: { page: $page, pageSize: $pageSize }) {
      nodes {
        documentId
        title
      }
    }
  }
`);

export const GetProjectsPageQuery = graphql(
  `
    query GetProjectsPage($page: Int, $pageSize: Int) {
      projects(pagination: { page: $page, pageSize: $pageSize }) {
        nodes {
          ...Project
        }
      }
    }
  `,
  [ProjectFragment],
);

export const GetProjectAuthorIdByProjectIdQuery = graphql(`
  query GetProjectAuthorIdByProjectId($projectId: ID!) {
    project(documentId: $projectId) {
      documentId
      author {
        documentId
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
        nodes {
          ...Project
        }
      }
    }
  `,
  [ProjectFragment],
);
