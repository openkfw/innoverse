import { graphql } from '@/types/graphql';
import { InnoUserFragment } from '@/utils/requests/innoUsers/queries';

export const PostFragment = graphql(
  `
    fragment Post on Post @_unmask {
      documentId
      comment
      updatedAt
      createdAt
      anonymous
      author {
        ...InnoUser
      }
    }
  `,
  [InnoUserFragment],
);

export const GetPostsQuery = graphql(
  `
    query GetPosts($limit: Int) {
      posts(sort: "updatedAt:desc", pagination: { limit: $limit }) {
        ...Post
      }
    }
  `,
  [PostFragment],
);

export const GetPostByIdQuery = graphql(
  `
    query GetPostById($id: ID!) {
      post(documentId: $id) {
        ...Post
      }
    }
  `,
  [PostFragment],
);

export const GetPostsByIdsQuery = graphql(
  `
    query GetPosts($ids: [ID], $sort: String! = "updatedAt:desc") {
      posts(sort: [$sort], filters: { documentId: { in: $ids } }) {
        ...Post
      }
    }
  `,
  [PostFragment],
);

export const GetPostsPageQuery = graphql(
  `
    query GetPosts($page: Int, $pageSize: Int, $sort: String!) {
      posts(pagination: { page: $page, pageSize: $pageSize }, sort: [$sort]) {
        ...Post
      }
    }
  `,
  [PostFragment],
);

export const GetPostsStartingFromQuery = graphql(
  `
    query GetPostsStartingFrom($from: DateTime, $page: Int, $pageSize: Int) {
      posts(
        filters: { or: [{ updatedAt: { gte: $from } }, { createdAt: { gte: $from } }] }
        pagination: { page: $page, pageSize: $pageSize }
      ) {
        ...Post
      }
    }
  `,
  [PostFragment],
);
