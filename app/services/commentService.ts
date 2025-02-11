'use server';

import { Comment, ObjectType, UserSession } from '@/common/types';
import { addCommentToDb, countComments, deleteCommentInDb, updateCommentInDb } from '@/repository/db/comment';
import { getFollowers } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getNewsTypeByString, mapDBCommentToRedisComment } from '@/utils/newsFeed/redis/mappings';
import { addNewsCommentToCache } from '@/utils/newsFeed/redis/services/commentsService';
import { NotificationTopic, notifyFollowers } from '@/utils/notification/notificationSender';
import { mapToComment } from '@/utils/requests/comments/mapping';

import { updatePostInCache } from './postService';
import { updateProjectUpdateInCache } from './updateService';

const logger = getLogger();

interface AddComment {
  author: UserSession;
  objectId: string;
  comment: string;
  objectType: ObjectType;
  parentCommentId?: string;
  projectId?: string;
}

interface RemoveComment {
  user: UserSession;
  commentId: string;
}

interface UpdateComment {
  author: UserSession;
  commentId: string;
  content: string;
}

export const addComment = async (body: AddComment): Promise<Comment> => {
  const { comment, objectType, author, objectId, parentCommentId } = body;
  const commentDb = await addCommentToDb({
    client: dbClient,
    objectId,
    objectType,
    author: author.providerId,
    text: comment,
    parentId: parentCommentId,
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

export const updateComment = async ({ author, commentId, content }: UpdateComment) => {
  const result = await updateCommentInDb(dbClient, commentId, content);
  await updateCommentInCache({ objectId: result.objectId, objectType: result.objectType as ObjectType }, author);
  return result;
};

export const removeComment = async ({ user, commentId }: RemoveComment) => {
  const result = await deleteCommentInDb(dbClient, commentId);
  const objectId = result.objectId;
  if (objectId) {
    await removeCommentInCache({ objectId, objectType: result.objectType as ObjectType }, user);
  }
};

const updateCommentInCache = async (comment: { objectId: string; objectType: ObjectType }, author: UserSession) => {
  const commentCount = await countComments(dbClient, comment.objectId);
  const body = { id: comment.objectId, commentCount };
  return comment.objectType === 'POST'
    ? await updatePostInCache({ post: body, user: author })
    : await updateProjectUpdateInCache({ update: body });
};

const removeCommentInCache = async (comment: { objectId: string; objectType: ObjectType }, author: UserSession) => {
  const commentCount = await countComments(dbClient, comment.objectId);
  const body = { id: comment.objectId, commentCount };
  return comment.objectType === 'POST'
    ? await updatePostInCache({ post: body, user: author })
    : await updateProjectUpdateInCache({ update: body });
};

const notifyObjectFollowers = async (objectId: string, objectType: ObjectType) => {
  try {
    const follows = await getFollowers(dbClient, objectType, objectId);
    await notifyFollowers(
      follows,
      ObjectType.POST.toLowerCase() as NotificationTopic,
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
