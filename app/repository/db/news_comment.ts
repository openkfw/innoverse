import { PrismaClient } from '@prisma/client';

import { defaultParamsComment as defaultParams } from '@/repository/db/utils/types';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

const logger = getLogger();

export async function countNewsResponses(client: PrismaClient, newsId: string) {
  try {
    return await client.newsComment.count({
      where: {
        newsId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Count responses to news item with id: ${newsId}`, err as Error, newsId);
    logger.error(error);
    throw err;
  }
}

export async function getNewsCommentsByUpdateId(client: PrismaClient, newsId: string) {
  return await client.newsComment.findMany({
    where: {
      newsId,
    },
    ...defaultParams,
  });
}

export async function getNewsCommentById(client: PrismaClient, commentId: string) {
  return await client.newsComment.findUnique({
    where: {
      id: commentId,
    },
    ...defaultParams,
  });
}

export async function addNewsCommentToDb(
  client: PrismaClient,
  newsId: string,
  author: string,
  comment: string,
  parentCommentId?: string,
) {
  return await client.newsComment.create({
    data: {
      newsId,
      comment: {
        create: {
          author,
          objectType: 'NEWS_COMMENT',
          text: comment,
          parentId: parentCommentId,
        },
      },
    },
    ...defaultParams,
  });
}

export async function updateNewsCommentInDb(client: PrismaClient, commentId: string, updatedText: string) {
  return await client.newsComment.update({
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

export async function deleteNewsCommentInDb(client: PrismaClient, commentId: string) {
  return client.comment.delete({
    where: {
      id: commentId,
      objectType: 'NEWS_COMMENT',
    },
    include: {
      newsComment: true,
    },
  });
}

export async function isNewsCommentUpvotedBy(client: PrismaClient, commentId: string, upvotedBy: string) {
  const likedCommentsCount = await client.comment.count({
    where: {
      id: commentId,
      objectType: 'NEWS_COMMENT',
      upvotedBy: { has: upvotedBy },
    },
  });
  return likedCommentsCount > 0;
}

export async function handleNewsCommentUpvotedByInDb(client: PrismaClient, commentId: string, upvotedBy: string) {
  return client.$transaction(async (tx) => {
    const result = await tx.comment.findFirst({
      where: { id: commentId, objectType: 'NEWS_COMMENT' },
      select: {
        upvotedBy: true,
      },
    });

    const upvotes = result?.upvotedBy.filter((upvote) => upvote !== upvotedBy);
    if (result?.upvotedBy.includes(upvotedBy)) {
      return tx.comment.update({
        where: {
          id: commentId,
          objectType: 'NEWS_COMMENT',
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
          objectType: 'NEWS_COMMENT',
        },
        data: {
          upvotedBy: { push: upvotedBy },
        },
      });
    }
  });
}

export async function getNewsCommentsStartingFrom(client: PrismaClient, from: Date) {
  return await client.comment.findMany({
    where: { objectType: 'NEWS_COMMENT', updatedAt: { gte: from } },
    include: {
      newsComment: true,
    },
  });
}
