import { ObjectType, PrismaClient } from '@prisma/client';

import { defaultParamsComment as defaultParams } from '@/repository/db/utils/types';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

const logger = getLogger();

export async function countComments(client: PrismaClient, objectId: string) {
  try {
    return await client.comment.count({
      where: {
        objectId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Counting comments for object with id: ${objectId}`,
      err as Error,
      objectId,
    );
    logger.error(error);
    throw err;
  }
}

export async function getCommentsByObjectId(client: PrismaClient, objectId: string) {
  try {
    return await client.comment.findMany({
      where: {
        objectId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Get comments by object with id: ${objectId}`, err as Error, objectId);
    logger.error(error);
    throw err;
  }
}

export async function getCommentById(client: PrismaClient, commentId: string) {
  try {
    return await client.comment.findFirst({
      where: {
        id: commentId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Get comment by id: ${commentId}`, err as Error, commentId);
    logger.error(error);
    throw err;
  }
}

export async function addCommentToDb(
  client: PrismaClient,
  objectId: string,
  objectType: ObjectType,
  author: string,
  comment: string,
  parentCommentId?: string,
  visible?: boolean,
) {
  try {
    return await client.comment.create({
      data: {
        objectType,
        objectId,
        // comment: {
        //   create: {
        author,
        text: comment,
        parentId: parentCommentId,
        visible,
      },
      //   },
      // },
      ...defaultParams,
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Add comment to ${objectType} with id: ${objectId} by user ${author}`,
      err as Error,
      objectId,
    );
    logger.error(error);
    throw err;
  }
}

export async function updateCommentInDb(client: PrismaClient, commentId: string, updatedText: string) {
  try {
    return await client.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text: updatedText,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Update comment with id: ${commentId}`, err as Error, commentId);
    logger.error(error);
    throw err;
  }
}

export async function deleteCommentInDb(client: PrismaClient, commentId: string) {
  try {
    return client.comment.delete({
      where: {
        id: commentId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Delete post for comment with id: ${commentId}`, err as Error, commentId);
    logger.error(error);
    throw err;
  }
}

export async function getCommentsStartingFrom(client: PrismaClient, from: Date, objectType: ObjectType) {
  try {
    return await client.comment.findMany({
      where: { objectType, updatedAt: { gte: from } },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Get post comments starting from ${from}`, err as Error);
    logger.error(error);
    throw err;
  }
}

//replace upvote with like
export async function isCommentLikedBy(client: PrismaClient, commentId: string, likedBy: string) {
  const likedCommentsCount = await client.comment.count({
    where: {
      id: commentId,
      likes: { some: { likedBy } }, //todo test this
    },
  });
  return likedCommentsCount > 0;
}
