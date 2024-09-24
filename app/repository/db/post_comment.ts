import { PrismaClient } from '@prisma/client';

import { defaultParamsComment as defaultParams } from '@/repository/db/utils/types';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

const logger = getLogger();

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
  return await client.postComment.findMany({
    where: {
      postId,
    },
    ...defaultParams,
  });
}

export async function getPostComments(client: PrismaClient, commentId: string) {
  return await client.postComment.findMany({
    where: {
      comment: {
        parentId: commentId,
      },
    },
    ...defaultParams,
  });
}

export async function getPostCommentById(client: PrismaClient, commentId: string) {
  return await client.postComment.findUnique({
    where: {
      id: commentId,
    },
    ...defaultParams,
  });
}

export async function addPostCommentToDb(
  client: PrismaClient,
  postId: string,
  author: string,
  comment: string,
  parentCommentId?: string,
) {
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
}

export async function updatePostCommentInDb(client: PrismaClient, commentId: string, updatedText: string) {
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
}

export async function deletePostCommentInDb(client: PrismaClient, commentId: string) {
  return client.comment.delete({
    where: {
      id: commentId,
    },
    include: {
      postComment: true,
    },
  });
}

export async function isPostCommentUpvotedBy(client: PrismaClient, commentId: string, upvotedBy: string) {
  const likedCommentsCount = await client.comment.count({
    where: {
      id: commentId,
      objectType: 'POST_COMMENT',
      upvotedBy: { has: upvotedBy },
    },
  });
  return likedCommentsCount > 0;
}

export async function handlePostCommentUpvotedByInDb(client: PrismaClient, commentId: string, upvotedBy: string) {
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
}

export async function getPostCommentsStartingFrom(client: PrismaClient, from: Date) {
  return await client.comment.findMany({
    where: { objectType: 'POST_COMMENT', updatedAt: { gte: from } },
    include: {
      postComment: true,
    },
  });
}
