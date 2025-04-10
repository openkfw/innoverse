import { graphql } from '@/types/graphql';
import { PostFragment } from '@/utils/requests/posts/queries';

export const DeletePostMutation = graphql(`
  mutation DeletePost($postId: ID!) {
    deletePost(documentId: $postId) {
      documentId
    }
  }
`);

export const CreatePostMutation = graphql(
  `
    mutation CreatePost($comment: String, $authorId: ID!, $anonymous: Boolean!) {
      createPost(data: { comment: $comment, author: $authorId, anonymous: $anonymous }) {
        ...Post
      }
    }
  `,
  [PostFragment],
);

export const UpdatePostMutation = graphql(
  `
    mutation UpdatePost($postId: ID!, $comment: String) {
      updatePost(documentId: $postId, data: { comment: $comment }) {
        ...Post
      }
    }
  `,
  [PostFragment],
);
