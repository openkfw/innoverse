import { PrismaClient } from '@prisma/client';

import { defaultParamsComment as defaultParams } from '@/repository/db/utils/types';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

const logger = getLogger();

// TODO: remove when the comments will be fetched from Redis cache, not DB
export async function countPostResponses(client: PrismaClient, postId: string) {
  try {
    return await client.postComment.count({
      where: {
        postId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Counting reponses for post with id: ${postId}`, err as Error, postId);
    logger.error(error);
    throw err;
  }
}

export async function getNewsCommentsByPostId(client: PrismaClient, postId: string) {
  try {
    return await client.postComment.findMany({
      where: {
        postId,
      },
      ...defaultParams,
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Get news comments by post with id: ${postId}`, err as Error, postId);
    logger.error(error);
    throw err;
  }
}

export async function getPostComments(client: PrismaClient, commentId: string) {
  try {
    return await client.postComment.findMany({
      where: {
        comment: {
          parentId: commentId,
        },
      },
      ...defaultParams,
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Get post for comment with id: ${commentId}`, err as Error, commentId);
    logger.error(error);
    throw err;
  }
}

export async function getPostCommentById(client: PrismaClient, commentId: string) {
  try {
    return await client.postComment.findUnique({
      where: {
        id: commentId,
      },
      ...defaultParams,
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Get post by id for comment with id: ${commentId}`,
      err as Error,
      commentId,
    );
    logger.error(error);
    throw err;
  }
}

export async function addPostCommentToDb(
  client: PrismaClient,
  postId: string,
  author: string,
  comment: string,
  parentCommentId?: string,
) {
  try {
    return await client.postComment.create({
      data: {
        postId,
        comment: {
          create: {
            author,
            objectType: 'POST_COMMENT',
            text: comment,
            parentId: parentCommentId,
          },
        },
      },
      ...defaultParams,
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Add comment to post with id: ${postId} by user ${author}`,
      err as Error,
      postId,
    );
    logger.error(error);
    throw err;
  }
}

export async function updatePostCommentInDb(client: PrismaClient, commentId: string, updatedText: string) {
  try {
    return await client.postComment.update({
      where: {
        commentId,
      },
      data: {
        comment: {
          update: {
            text: updatedText,
          },
        },
      },
      ...defaultParams,
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Update post comment with id: ${commentId}`, err as Error, commentId);
    logger.error(error);
    throw err;
  }
}

export async function deletePostCommentInDb(client: PrismaClient, commentId: string) {
  try {
    return client.comment.delete({
      where: {
        id: commentId,
      },
      include: {
        postComment: true,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Delete post for comment with id: ${commentId}`, err as Error, commentId);
    logger.error(error);
    throw err;
  }
}

export async function isPostCommentUpvotedBy(client: PrismaClient, commentId: string, upvotedBy: string) {
  const likedCommentsCount = await client.comment.count({
    where: {
      id: commentId,
      objectType: 'POST_COMMENT',
      upvotedBy: { has: upvotedBy },
    },
  });
  try {
    return likedCommentsCount > 0;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Get upvote by user for comment with id: ${commentId}`,
      err as Error,
      commentId,
    );
    logger.error(error);
    throw err;
  }
}

export async function handlePostCommentUpvotedByInDb(client: PrismaClient, commentId: string, upvotedBy: string) {
  try {
    return client.$transaction(async (tx) => {
      const result = await tx.comment.findFirst({
        where: { id: commentId, objectType: 'POST_COMMENT' },
        select: {
          upvotedBy: true,
        },
      });

      const upvotes = result?.upvotedBy.filter((upvote) => upvote !== upvotedBy);
      if (result?.upvotedBy.includes(upvotedBy)) {
        return tx.comment.update({
          where: {
            id: commentId,
            objectType: 'POST_COMMENT',
          },
          data: {
            upvotedBy: upvotes,
          },
        });
      }

      if (result) {
        return tx.comment.update({
          where: {
            id: commentId,
            objectType: 'POST_COMMENT',
          },
          data: {
            upvotedBy: { push: upvotedBy },
          },
        });
      }
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Handle post comment upvote for comment with id: ${commentId}`,
      err as Error,
      commentId,
    );
    logger.error(error);
    throw err;
  }
}

export async function getPostCommentsStartingFrom(client: PrismaClient, from: Date) {
  try {
    return await client.comment.findMany({
      where: { objectType: 'POST_COMMENT', updatedAt: { gte: from } },
      include: {
        postComment: true,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Get post comments starting from ${from}`, err as Error);
    logger.error(error);
    throw err;
  }
}
