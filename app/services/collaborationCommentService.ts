'use server';

import type { CollaborationComment as PrismaCollaborationComment } from '@prisma/client';

import { ObjectType, User, UserSession } from '@/common/types';
import {
  addCollaborationCommentToDb,
  deleteCollaborationCommentInDb,
  getCollaborationCommentById,
  getCollaborationCommentUpvotedBy,
  handleCollaborationCommentUpvoteInDb,
} from '@/repository/db/collaboration_comment';
import { updateCollaborationCommentInDb } from '@/repository/db/collaboration_comment';
import { getCollaborationCommentResponseCount } from '@/repository/db/collaboration_comment_response';
import { getFollowedByForEntity } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import {
  mapCollaborationCommentToRedisNewsFeedEntry,
  mapToRedisUser,
  mapToRedisUsers,
} from '@/utils/newsFeed/redis/mappings';
import { NewsType, RedisCollaborationComment } from '@/utils/newsFeed/redis/models';
import { getRedisClient, RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { deleteItemFromRedis, getNewsFeedEntryByKey, saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';
import { getBasicCollaborationQuestionById } from '@/utils/requests/collaborationQuestions/requests';
import { getProjectTitleById } from '@/utils/requests/project/requests';

const logger = getLogger();

type AddCollaborationComment = {
  user: UserSession;
  comment: {
    projectId: string;
    questionId: string;
    comment: string;
    visible?: boolean;
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
    upvotedBy?: string[];
    responseCount?: number;
  };
  user: User;
};

type UpvoteCollaborationComment = {
  user: UserSession;
  commentId: string;
};

export const addCollaborationComment = async ({ user, comment }: AddCollaborationComment) => {
  try {
    const createdComment = await addCollaborationCommentToDb(
      dbClient,
      comment.projectId,
      comment.questionId,
      user.providerId,
      comment.comment,
      comment.visible,
    );

    await addCollaborationCommentToCache(user, createdComment);
    return createdComment;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Add collaboration comment to project with id: ${comment.projectId} and question with id: ${comment.questionId} by user ${user.providerId}`,
      err as Error,
      comment.projectId,
    );
    logger.error(error);
    throw err;
  }
};

export const deleteCollaborationComment = async (commentId: string) => {
  try {
    await deleteCollaborationCommentInDb(dbClient, commentId);
    await deleteCollaborationCommentInCache(commentId);
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Delete collaboration comment with id: ${commentId}`,
      err as Error,
      commentId,
    );
    logger.error(error);
    throw err;
  }
};

export const updateCollaborationComment = async ({ user, comment }: UpdateCollaborationComment) => {
  try {
    const updatedComment = await updateCollaborationCommentInDb(dbClient, comment.id, comment.comment);
    await updateCollaborationCommentInCache({ user, comment });
    return updatedComment;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Update collaboration comment with id: ${comment.id}`,
      err as Error,
      comment.id,
    );
    logger.error(error);
    throw err;
  }
};

export const handleCollaborationCommentUpvote = async ({ user, commentId }: UpvoteCollaborationComment) => {
  try {
    const updatedComment = await handleCollaborationCommentUpvoteInDb(dbClient, commentId, user.providerId);

    if (updatedComment) {
      await updateCollaborationCommentInCache({ user, comment: updatedComment });
    }
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Handle upvote for collaboration comment with id: ${commentId} by user ${user.providerId}`,
      err as Error,
      commentId,
    );
    logger.error(error);
    throw err;
  }
};

export const addCollaborationCommentToCache = async (user: User, comment: { id: string }) => {
  const newsFeedEntry = await createNewsFeedEntryForCommentById(comment.id, user);
  if (!newsFeedEntry) return;
  const redisClient = await getRedisClient();
  await saveNewsFeedEntry(redisClient, newsFeedEntry);
};

export const deleteCollaborationCommentInCache = async (commentId: string) => {
  const redisClient = await getRedisClient();
  const redisKey = getRedisKey(commentId);
  await deleteItemFromRedis(redisClient, redisKey);
};

export const updateCollaborationCommentInCache = async ({ user, comment }: UpdateCollaborationCommentInCache) => {
  const redisClient = await getRedisClient();
  const newsFeedEntry = await getNewsFeedEntryForComment(redisClient, { user, commentId: comment.id });

  if (!newsFeedEntry) return;

  const cachedItem = newsFeedEntry.item as RedisCollaborationComment;
  cachedItem.comment = comment.comment ?? cachedItem.comment;
  cachedItem.upvotedBy = comment.upvotedBy ?? cachedItem.upvotedBy;
  cachedItem.responseCount = comment.responseCount ?? cachedItem.responseCount;
  newsFeedEntry.item = cachedItem;

  await saveNewsFeedEntry(redisClient, newsFeedEntry);
  return newsFeedEntry.item;
};

export const getNewsFeedEntryForComment = async (
  redisClient: RedisClient,
  { user, commentId }: { user: User; commentId: string },
) => {
  const redisKey = getRedisKey(commentId);
  const cacheEntry = await getNewsFeedEntryByKey(redisClient, redisKey);
  return cacheEntry ?? (await createNewsFeedEntryForCommentById(commentId, user));
};

export const createNewsFeedEntryForCommentById = async (commentId: string, user?: User) => {
  const comment: PrismaCollaborationComment | null = await getCollaborationCommentById(dbClient, commentId);

  if (!comment) {
    logger.warn(`Failed to create news feed entry for collaboration comment with id ${commentId}: Comment not found`);
    return null;
  }

  return await createNewsFeedEntryForComment(comment, user);
};

export const createNewsFeedEntryForComment = async (comment: PrismaCollaborationComment, user?: User) => {
  const question = await getBasicCollaborationQuestionById(comment.questionId);

  if (!question) {
    logger.warn(
      `Failed to create news feed entry for collaboration comment with id ${comment.id}: Failed to get basic collaboration question`,
    );
    return null;
  }

  const author = user ?? (await mapToRedisUser(comment.author));
  const responseCount = await getCollaborationCommentResponseCount(dbClient, comment.id);
  const upvotedBy = (await getCollaborationCommentUpvotedBy(dbClient, comment.id)) ?? [];
  const reactions = await getReactionsForEntity(dbClient, ObjectType.COLLABORATION_COMMENT, comment.id);
  const followerIds = await getFollowedByForEntity(dbClient, ObjectType.PROJECT, question.projectId);
  const followers = await mapToRedisUsers(followerIds);
  const projectName = await getProjectTitleById(comment.projectId);

  return mapCollaborationCommentToRedisNewsFeedEntry(
    { ...comment, projectName: projectName ?? '', upvotedBy, author, responseCount },
    question,
    reactions,
    followers,
  );
};

const getRedisKey = (commentId: string) => `${NewsType.COLLABORATION_COMMENT}:${commentId}`;
