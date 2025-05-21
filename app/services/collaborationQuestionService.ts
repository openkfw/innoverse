'use server';

import { BasicCollaborationQuestion, ObjectType } from '@/common/types';
import { getFollowedByForEntity } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { InnoPlatformError, redisError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapCollaborationQuestionToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { NewsType } from '@/utils/newsFeed/redis/models';
import { RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { getNewsFeedEntryByKey } from '@/utils/newsFeed/redis/redisService';
import { getBasicCollaborationQuestionById } from '@/utils/requests/collaborationQuestions/requests';
import { getCommentsByObjectIdWithResponses } from '@/utils/requests/comments/requests';

const logger = getLogger();

export const getNewsFeedEntryForCollaborationQuestion = async (redisClient: RedisClient, questionId: string) => {
  try {
    const redisKey = getRedisKey(questionId);
    const cacheEntry = await getNewsFeedEntryByKey(redisClient, redisKey);
    return cacheEntry ?? (await getNewsFeedEntryForCollaborationQuestionById(questionId));
  } catch (err) {
    const error: InnoPlatformError = redisError(
      `Get news feed entry for collaboration question with id: ${questionId}`,
      err as Error,
    );
    logger.error(error);
    throw err;
  }
};

const getNewsFeedEntryForCollaborationQuestionById = async (questionId: string) => {
  const question = await getBasicCollaborationQuestionById(questionId);
  if (!question) {
    logger.warn(
      `Failed to create news feed cache entry for collaboration question with id '${questionId}': Collaboration question not found`,
    );
    return null;
  }
  return await createNewsFeedEntryForCollaborationQuestion(question);
};

export const createNewsFeedEntryForCollaborationQuestion = async (question: BasicCollaborationQuestion) => {
  const { comments } = await getCommentsByObjectIdWithResponses(question.id, ObjectType.COLLABORATION_QUESTION);
  const reactions = await getReactionsForEntity(dbClient, ObjectType.COLLABORATION_QUESTION, question.id);
  const questionFollowerIds = await getFollowedByForEntity(dbClient, ObjectType.COLLABORATION_QUESTION, question.id);
  const questionFollowers = await mapToRedisUsers(questionFollowerIds);
  return mapCollaborationQuestionToRedisNewsFeedEntry(question, reactions, questionFollowers, comments);
};

const getRedisKey = (questionId: string) => `${NewsType.COLLABORATION_QUESTION}:${questionId}`;
