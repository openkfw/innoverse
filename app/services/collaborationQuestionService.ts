'use server';

import { ObjectType } from '@/common/types';
import { getFollowedByForEntity } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { InnoPlatformError, redisError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapCollaborationQuestionToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { NewsType } from '@/utils/newsFeed/redis/models';
import { RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { getNewsFeedEntryByKey } from '@/utils/newsFeed/redis/redisService';
import { getBasicCollaborationQuestionByIdWithAdditionalData } from '@/utils/requests/collaborationQuestions/requests';

const logger = getLogger();

export const getNewsFeedEntryForCollaborationQuestion = async (redisClient: RedisClient, questionId: string) => {
  try {
    const redisKey = getRedisKey(questionId);
    const cacheEntry = await getNewsFeedEntryByKey(redisClient, redisKey);
    return cacheEntry ?? (await createNewsFeedEntryForCollaborationQuestion(questionId));
  } catch (err) {
    const error: InnoPlatformError = redisError(
      `Get news feed entry for collaboration question with id: ${questionId}`,
      err as Error,
    );
    logger.error(error);
    throw err;
  }
};

const createNewsFeedEntryForCollaborationQuestion = async (questionId: string) => {
  const question = await getBasicCollaborationQuestionByIdWithAdditionalData(questionId);
  if (!question) {
    logger.warn(
      `Failed to create news feed cache entry for collaboration question with id '${questionId}': Failed to get question`,
    );
    return null;
  }
  const questionFollowerIds = await getFollowedByForEntity(dbClient, ObjectType.COLLABORATION_QUESTION, question.id);
  const questionFollowers = await mapToRedisUsers(questionFollowerIds);
  return mapCollaborationQuestionToRedisNewsFeedEntry(question, question.reactions, questionFollowers);
};

const getRedisKey = (questionId: string) => `${NewsType.COLLABORATION_QUESTION}:${questionId}`;
