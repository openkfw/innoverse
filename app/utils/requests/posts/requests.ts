'use server';

import { StatusCodes } from 'http-status-codes';

import { ObjectType, StartPagination, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { getCommentsStartingFrom } from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { findReaction } from '@/repository/db/reaction';
import { withAuth } from '@/utils/auth';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import { getUniqueValues } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { CreatePostMutation, DeletePostMutation, UpdatePostMutation } from '@/utils/requests/posts/mutations';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

import { getInnoUserByProviderId } from '../innoUsers/requests';

import { mapToPost, mapToPosts } from './mappings';
import { GetPostByIdQuery, GetPostsByIdsQuery, GetPostsStartingFromQuery } from './queries';

const logger = getLogger();

export async function getPostById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetPostByIdQuery, { id });
    const postData = response.post;
    if (!postData) return null;
    const post = mapToPost(postData);
    return post;
  } catch (err) {
    const error = strapiError('Getting post by id', err as RequestError, id);
    logger.error(error);
  }
}

export async function createPostInStrapi(body: { comment: string; authorId: string; anonymous: boolean }) {
  try {
    const user = await getInnoUserByProviderId(body.authorId);
    const response = await strapiGraphQLFetcher(CreatePostMutation, {
      authorId: user.id || '0',
      comment: body.comment,
      anonymous: body.anonymous,
    });

    const postData = response.createPost;
    if (!postData) throw 'Response contained no post';

    const post = mapToPost(postData);
    return post;
  } catch (err) {
    const error = strapiError('Trying to to create post', err as RequestError);
    logger.error(error);
  }
}

export async function deletePostFromStrapi(id: string) {
  try {
    const response = await strapiGraphQLFetcher(DeletePostMutation, { postId: id });
    const postData = response.deletePost;
    if (!postData) throw new Error('Response contained no removed post');
    return postData.documentId;
  } catch (err) {
    const error = strapiError('Removing post', err as RequestError, id);
    logger.error(error);
  }
}

export async function updatePostInStrapi(id: string, comment: string) {
  try {
    const response = await strapiGraphQLFetcher(UpdatePostMutation, {
      postId: id,
      comment,
    });
    const updatedPost = response.updatePost;
    if (!updatedPost) throw new Error('Response contained no updated post');
    const post = mapToPost(updatedPost);
    return post;
  } catch (err) {
    const error = strapiError('Updating post', err as RequestError, id);
    logger.error(error);
  }
}

export const findReactionByUser = withAuth(
  async (user: UserSession, body: { objectType: ObjectType; objectId: string }) => {
    try {
      const result = await findReaction(dbClient, user.providerId, body.objectType, body.objectId);
      return {
        status: StatusCodes.OK,
        data: result,
      };
    } catch (err) {
      const error: InnoPlatformError = strapiError(
        `Find reaction for ${user.providerId} and ${body.objectType} ${body.objectId} `,
        err as RequestError,
        body.objectId,
      );
      logger.error(error);
      throw err;
    }
  },
);

export async function getPostsStartingFrom({ from, page, pageSize }: StartPagination) {
  try {
    const response = await strapiGraphQLFetcher(GetPostsStartingFromQuery, { from, page, pageSize });
    if (!response?.posts) throw new Error('Response contained no posts');

    const posts = await mapToPosts(response.posts);

    const postComments = await getCommentsStartingFrom(dbClient, from, ObjectType.POST);
    // Get unique ids of posts
    const postsIds = getUniqueValues(
      postComments.map((comment) => comment?.objectId).filter((id): id is string => id !== undefined),
    );

    if (postsIds.length > 0) {
      const res = await strapiGraphQLFetcher(GetPostsByIdsQuery, { ids: postsIds });
      const postsWithComments = await mapToPosts(res.posts);

      const combinedUpdates = [...posts, ...postsWithComments];
      const uniquePosts = combinedUpdates.filter(
        (post, index, self) => index === self.findIndex((t) => t.id === post.id),
      );
      return uniquePosts;
    }

    return posts;
  } catch (err) {
    const error = strapiError(`Getting posts starting from ${from}`, err as RequestError);
    logger.error(error);
  }
}
