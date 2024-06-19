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
