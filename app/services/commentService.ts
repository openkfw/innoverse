'use server';

import { Comment, ObjectType, UserSession } from '@/common/types';
import { addCommentToDb, deleteCommentInDb, updateCommentInDb } from '@/repository/db/comment';
import { getFollowers } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { CommentDB } from '@/repository/db/utils/types';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getNewsTypeByString, mapDBCommentToRedisComment } from '@/utils/newsFeed/redis/mappings';
import {
  addNewsCommentToCache,
  deleteNewsCommentInCache,
  updateNewsCommentInCache,
} from '@/utils/newsFeed/redis/services/commentsService';
import { NotificationTopic, notifyFollowers } from '@/utils/notification/notificationSender';
import { mapToComment } from '@/utils/requests/comments/mapping';

const logger = getLogger();

interface AddComment {
  author: UserSession;
  objectId: string;
  comment: string;
  objectType: ObjectType;
  parentCommentId?: string;
  projectId?: string;
  anonymous?: boolean;
  additionalObjectType?: ObjectType;
  additionalObjectId?: string;
}

interface RemoveComment {
  commentId: string;
}

interface UpdateComment {
  author: UserSession;
  commentId: string;
  content: string;
}

export const addComment = async (body: AddComment): Promise<Comment> => {
  const {
    comment,
    objectType,
    author,
    objectId,
    parentCommentId,
    anonymous,
    additionalObjectType,
    additionalObjectId,
  } = body;
  const commentDb = await addCommentToDb({
    client: dbClient,
    objectId,
    objectType,
    author: author.providerId,
    text: comment,
    parentId: parentCommentId,
    ...(anonymous && { anonymous }),
    ...(additionalObjectId && { additionalObjectId }),
    ...(additionalObjectType && { additionalObjectType }),
  });
  const redisComment = await mapDBCommentToRedisComment(commentDb);
  await addNewsCommentToCache({
    newsType: getNewsTypeByString(objectType),
    newsId: objectId,
    comment: redisComment,
    parentId: parentCommentId,
  });
  notifyObjectFollowers(objectId, objectType);
  return await mapToComment(commentDb);
};

export const updateComment = async ({ commentId, content }: UpdateComment) => {
  const result = await updateCommentInDb(dbClient, commentId, content);
  await updateCommentInCache(result);
  return result;
};

export const removeComment = async ({ commentId }: RemoveComment) => {
  const result = await deleteCommentInDb(dbClient, commentId);
  const objectId = result.objectId;
  if (objectId) {
    await removeCommentInCache({ objectId, objectType: result.objectType as ObjectType, commentId });
  }
};

const updateCommentInCache = async (newsCommentDb: CommentDB) => {
  const redisNewsComment = await mapDBCommentToRedisComment(newsCommentDb);
  await updateNewsCommentInCache(redisNewsComment);
};

const removeCommentInCache = async (comment: { objectId: string; objectType: ObjectType; commentId: string }) => {
  const { objectId, objectType, commentId } = comment;
  await deleteNewsCommentInCache(getNewsTypeByString(objectType), objectId, commentId);
};

const notifyObjectFollowers = async (objectId: string, objectType: ObjectType) => {
  try {
    const follows = await getFollowers(dbClient, objectType, objectId);
    await notifyFollowers(
      follows,
      objectType.toLowerCase() as NotificationTopic,
      `Jemand hat auf einen ${objectType}, dem du folgst, kommentiert.`,
      '/news',
    );
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Notify followers about updated ${objectType} with id: ${objectId}`,
      err as Error,
      objectId,
    );
    logger.error(error);
    throw err;
  }
};
