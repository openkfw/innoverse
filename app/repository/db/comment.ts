import { ObjectType as PrismaObjectType, PrismaClient } from '@prisma/client';

import { ObjectType } from '@/common/types';
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

export async function getCommentsByObjectIdAndType(
  client: PrismaClient,
  objectId: string,
  objectType: ObjectType,
  sort: 'asc' | 'desc' = 'desc',
) {
  try {
    return await client.comment.findMany({
      where: {
        objectId,
        objectType: objectType as PrismaObjectType,
      },
      orderBy: {
        createdAt: sort,
      },
      ...defaultParams,
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
      ...defaultParams,
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Get comment by id: ${commentId}`, err as Error, commentId);
    logger.error(error);
    throw err;
  }
}

export async function addCommentToDb(comment: {
  client: PrismaClient;
  objectId: string;
  objectType: ObjectType;
  author: string;
  text: string;
  parentId?: string;
  additionalObjectType?: ObjectType;
  additionalObjectId?: string;
  anonymous?: boolean;
}) {
  const { client, objectId, objectType, author, text, parentId, anonymous, additionalObjectId, additionalObjectType } =
    comment;
  try {
    return await client.comment.create({
      data: {
        objectType: objectType as PrismaObjectType,
        objectId,
        author,
        text,
        parentId,
        anonymous,
        additionalObjectId,
        additionalObjectType: additionalObjectType as PrismaObjectType,
      },
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
    const error: InnoPlatformError = dbError(`Delete for comment with id: ${commentId}`, err as Error, commentId);
    logger.error(error);
    throw err;
  }
}

export async function getCommentsStartingFrom(client: PrismaClient, from: Date, objectType: ObjectType) {
  try {
    return await client.comment.findMany({
      where: { objectType: objectType as PrismaObjectType, updatedAt: { gte: from } },
      ...defaultParams,
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Get comments starting from ${from}`, err as Error);
    logger.error(error);
    throw err;
  }
}

export async function getCommentsByParentId(client: PrismaClient, parentId: string) {
  try {
    return await client.comment.findMany({
      where: {
        parentId,
      },
      ...defaultParams,
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Get comments by parent with id: ${parentId}`, err as Error, parentId);
    logger.error(error);
    throw err;
  }
}

export async function getCommentResponseCount(client: PrismaClient, commentId: string) {
  try {
    const comment = await client.comment.findFirst({
      where: {
        id: commentId,
      },
      ...defaultParams,
    });
    return comment?.responses.length;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Get comment response count for comment with id: ${commentId}`,
      err as Error,
      commentId,
    );
    logger.error(error);
    throw err;
  }
}

export async function getCommentsByAdditionalObjectId(
  client: PrismaClient,
  objectId: string,
  additionalObjectId: string,
  topLevel?: boolean,
) {
  try {
    return await client.comment.findMany({
      where: {
        objectId,
        additionalObjectId,
        ...(topLevel ? { parentId: null } : {}),
      },
      ...defaultParams,
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Get comments by object with id: ${objectId}`, err as Error, objectId);
    logger.error(error);
    throw err;
  }
}

export async function isCommentLikedBy(client: PrismaClient, commentId: string, likedBy: string) {
  const likedCommentsCount = await client.comment.count({
    where: {
      id: commentId,
      likes: { some: { likedBy } },
    },
  });
  return likedCommentsCount > 0;
}

export const updateCommentsId = async (
  client: PrismaClient,
  id: string,
  documentId: string,
  objectType: ObjectType,
) => {
  return await client.comment.updateMany({
    where: {
      objectId: id,
      objectType: objectType as PrismaObjectType,
    },
    data: {
      objectId: documentId,
    },
  });
};
export async function updateCommentObjectId(
  client: PrismaClient,
  oldObjectId: string,
  newObjectId: string,
  objectType: ObjectType,
) {
  return client.comment.updateMany({
    where: {
      objectId: oldObjectId,
      objectType: objectType as PrismaObjectType,
    },
    data: {
      objectId: newObjectId,
    },
  });
}
