'use server';

import { Comment, ObjectType, User, UserSession } from '@/common/types';
import {
  addCommentToDb,
  deleteCommentInDb,
  getCommentById,
  getCommentResponseCount,
  handleCommentLike,
  updateCommentInDb,
} from '@/repository/db/comment';
import { getFollowedByForEntity } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { InnoPlatformError, redisError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapCollaborationCommentToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { NewsType, RedisCollaborationComment } from '@/utils/newsFeed/redis/models';
import { getRedisClient, RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { deleteItemFromRedis, getNewsFeedEntryByKey, saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';
import { getBasicCollaborationQuestionById } from '@/utils/requests/collaborationQuestions/requests';
import { mapToCollborationComment, mapToComment } from '@/utils/requests/comments/mapping';
import { getProjectTitleById } from '@/utils/requests/project/requests';

const logger = getLogger();

type AddCollaborationComment = {
  user: UserSession;
  comment: {
    projectId: string;
    questionId: string;
    comment: string;
    anonymous?: boolean;
  };
};

type UpdateCollaborationComment = {
  comment: {
    id: string;
    comment: string;
  };
  user: User;
};

type UpdateCollaborationCommentInCache = {
  comment: {
    id: string;
    comment?: string;
    likedBy?: string[];
    commentCount?: number;
  };
  user: User;
};

type LikeCollaborationComment = {
  user: UserSession;
  commentId: string;
};

export const addCollaborationComment = async ({ user, comment }: AddCollaborationComment) => {
  const createdComment = await addCommentToDb({
    client: dbClient,
    objectId: comment.projectId,
    objectType: ObjectType.PROJECT,
    additionalObjectId: comment.questionId,
    additionalObjectType: ObjectType.COLLABORATION_QUESTION,
    author: user.providerId,
    text: comment.comment,
    anonymous: comment.anonymous,
  });
  await addCollaborationCommentToCache(user, createdComment);
  return await mapToCollborationComment(createdComment);
};

export const deleteCollaborationComment = async (commentId: string) => {
  await deleteCommentInDb(dbClient, commentId);
  await deleteCollaborationCommentInCache(commentId);
};

export const updateCollaborationComment = async ({ user, comment }: UpdateCollaborationComment) => {
  const updatedComment = await updateCommentInDb(dbClient, comment.id, comment.comment);
  await updateCollaborationCommentInCache({ user, comment });
  return updatedComment;
};

export const handleCollaborationCommentLike = async ({ user, commentId }: LikeCollaborationComment) => {
  const updatedComment = await handleCommentLike(dbClient, commentId, user.providerId);

  if (updatedComment) {
    await updateCollaborationCommentInCache({
      user,
      comment: { ...updatedComment, likedBy: [updatedComment.likedBy] },
    });
  }
};

export const addCollaborationCommentToCache = async (user: User, comment: { id: string }) => {
  try {
    const newsFeedEntry = await createNewsFeedEntryForCommentById(comment.id, user);
    if (!newsFeedEntry) return;
    const redisClient = await getRedisClient();
    await saveNewsFeedEntry(redisClient, newsFeedEntry);
  } catch (err) {
    const error: InnoPlatformError = redisError(
      `Add collaboration comment with id: ${comment.id} by user ${user}`,
      err as Error,
    );
    logger.error(error);
    throw err;
  }
};

export const deleteCollaborationCommentInCache = async (commentId: string) => {
  try {
    const redisClient = await getRedisClient();
    const redisKey = getRedisKey(commentId);
    await deleteItemFromRedis(redisClient, redisKey);
  } catch (err) {
    const error: InnoPlatformError = redisError(`Delete collaboration comment with id: ${commentId}`, err as Error);
    logger.error(error);
    throw err;
  }
};

export const updateCollaborationCommentInCache = async ({ user, comment }: UpdateCollaborationCommentInCache) => {
  try {
    const redisClient = await getRedisClient();
    const newsFeedEntry = await getNewsFeedEntryForComment(redisClient, { user, commentId: comment.id });

    if (!newsFeedEntry) return;

    const cachedItem = newsFeedEntry.item as RedisCollaborationComment;
    cachedItem.text = comment.comment ?? cachedItem.text;
    cachedItem.likedBy = comment.likedBy ?? cachedItem.likedBy;
    cachedItem.commentCount = comment.commentCount ?? cachedItem.commentCount;
    newsFeedEntry.item = cachedItem;

    await saveNewsFeedEntry(redisClient, newsFeedEntry);
    return newsFeedEntry.item;
  } catch (err) {
    const error: InnoPlatformError = redisError(`Delete collaboration comment with id: ${comment.id}`, err as Error);
    logger.error(error);
    throw err;
  }
};

export const getNewsFeedEntryForComment = async (
  redisClient: RedisClient,
  { user, commentId }: { user: User; commentId: string },
) => {
  try {
    const redisKey = getRedisKey(commentId);
    const cacheEntry = await getNewsFeedEntryByKey(redisClient, redisKey);
    return cacheEntry ?? (await createNewsFeedEntryForCommentById(commentId, user));
  } catch (err) {
    const error: InnoPlatformError = redisError(`Get news feed entry for comment with id: ${commentId}`, err as Error);
    logger.error(error);
    throw err;
  }
};

export const createNewsFeedEntryForCommentById = async (commentId: string, user?: User) => {
  const comment = await getCommentById(dbClient, commentId);

  if (!comment) {
    logger.warn(`Failed to create news feed entry for collaboration comment with id ${commentId}: Comment not found`);
    return null;
  }

  return await createNewsFeedEntryForComment(await mapToComment(comment), user);
};

export const createNewsFeedEntryForComment = async (comment: Comment, user?: User) => {
  if (!comment.additionalObjectId) {
    logger.warn(
      `Failed to create news feed entry for collaboration comment with id ${comment.id}: No additional object id found to get basic collaboration question`,
    );
    return null;
  }
  const question = await getBasicCollaborationQuestionById(comment.additionalObjectId || '');

  if (!question) {
    logger.warn(
      `Failed to create news feed entry for collaboration comment with id ${comment.id}: Failed to get basic collaboration question`,
    );
    return null;
  }

  const author = user ?? comment.author;
  const commentCount = (await getCommentResponseCount(dbClient, comment.id)) || 0;
  const reactions = await getReactionsForEntity(dbClient, ObjectType.COLLABORATION_COMMENT, comment.id);
  const followerIds = await getFollowedByForEntity(dbClient, ObjectType.PROJECT, question.projectId);
  const followers = await mapToRedisUsers(followerIds);
  const projectName = await getProjectTitleById(comment.objectId);

  return mapCollaborationCommentToRedisNewsFeedEntry(
    { ...comment, objectName: projectName ?? '', likedBy: comment.likedBy, author, commentCount },
    question,
    reactions,
    followers,
  );
};

const getRedisKey = (commentId: string) => `${NewsType.COLLABORATION_COMMENT}:${commentId}`;
