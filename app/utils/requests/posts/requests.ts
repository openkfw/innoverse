'use server';

import { RequestError } from '@/entities/error';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { mapToProjectUpdate } from '@/utils/requests/updates/mappings';
import { CreatePostMutation, DeletePostMutation, UpdatePostMutation } from '@/utils/requests/posts/mutations';
import { GetUpdatesQuery } from '@/utils/requests/updates/queries';
import { mapToPost, mapToPosts } from './mappings';
import { getInnoUserByProviderId } from '../innoUsers/requests';
import { GetPostByIdQuery, GetPostsByIdsQuery, GetPostsStartingFromQuery } from './queries';
import { ObjectType, StartPagination, UserSession } from '@/common/types';
import { getCommentsStartingFrom } from '@/repository/db/comment';
import { getUniqueValues } from '@/utils/helpers';
import dbClient from '@/repository/db/prisma/prisma';
import { withAuth } from '@/utils/auth';
import { StatusCodes } from 'http-status-codes';
import { findReaction } from '@/repository/db/reaction';

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
    if (!postData) throw 'Response contained no update';

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
    const updatedUpdate = response.updatePost;
    if (!updatedUpdate) throw new Error('Response contained no updated post');
    const update = mapToPost(updatedUpdate);
    return update;
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
    // Get unique ids of updates
    const postsIds = getUniqueValues(
      postComments.map((comment) => comment?.objectId).filter((id): id is string => id !== undefined),
    );

    if (postsIds.length > 0) {
      const res = await strapiGraphQLFetcher(GetPostsByIdsQuery, { ids: postsIds });
      const postsWithComments = await mapToPosts(res.posts);

      const combinedUpdates = [...posts, ...postsWithComments];
      const uniquePosts = combinedUpdates.filter(
        (update, index, self) => index === self.findIndex((t) => t.id === update.id),
      );
      return uniquePosts;
    }

    return posts;
  } catch (err) {
    const error = strapiError(`Getting posts starting from ${from}`, err as RequestError);
    logger.error(error);
  }
}
