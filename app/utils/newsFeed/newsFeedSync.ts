import dayjs from 'dayjs';

import { ObjectType } from '@/common/types';
import { getCollaborationCommentStartingFrom } from '@/repository/db/collaboration_comment';
import { getCollaborationCommentResponseCount } from '@/repository/db/collaboration_comment_response';
import { getFollowedByForEntity } from '@/repository/db/follow';
import { countPostResponses } from '@/repository/db/post_comment';
import { getPostsStartingFrom } from '@/repository/db/posts';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { redisError } from '@/utils/errors';
import { getUnixTimestamp, unixTimestampToDate } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import {
  mapCollaborationCommentToRedisNewsFeedEntry,
  mapToRedisCollaborationQuestion,
  mapToRedisPost,
  mapToRedisUsers,
} from '@/utils/newsFeed/redis/mappings';
import { NewsType, RedisNewsFeedEntry, RedisProjectEvent, RedisProjectUpdate } from '@/utils/newsFeed/redis/models';
import { getRedisClient, RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { getProjectsEvents } from '@/utils/newsFeed/redis/requests/events';
import { getProjectsUpdates } from '@/utils/newsFeed/redis/requests/projectUpdates';
import {
  getBasicCollaborationQuestionById,
  getBasicCollaborationQuestionStartingFromWithAdditionalData,
} from '@/utils/requests/collaborationQuestions/requests';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';

import {
  getLatestSuccessfulNewsFeedSync,
  getNewsFeedEntries,
  performRedisTransaction,
  saveNewsFeedSync,
  transactionalDeleteItemsFromRedis,
  transactionalSaveNewsFeedEntry,
} from './redis/redisService';
import { getProjectName } from '../requests/project/requests';

const logger = getLogger();
const maxSyncRetries = 3;

export const sync = async (retry?: number) => {
  const now = new Date();
  retry ??= 0;

  try {
    logger.info(`Starting news feed synchronization at ${now.toISOString()} (retry: ${retry}) ...`);
    const redisClient = await getRedisClient();
    const lastSync = await getLatestSuccessfulNewsFeedSync(redisClient);
    const syncFrom = lastSync ? unixTimestampToDate(lastSync.syncedAt) : dayjs(now).subtract(6, 'months').toDate();

    logger.info(`Sync news feed items starting from ${syncFrom.toISOString()} ...`);

    const itemsToSync = await Promise.all([
      aggregateProjectUpdates({ from: syncFrom }),
      aggregateProjectEvents({ from: syncFrom }),
      aggregatePosts({ from: syncFrom }),
      aggregateCollaborationQuestions({ from: syncFrom }),
      aggregateCollaborationComments({ from: syncFrom }),
    ]);

    const affectedEntries = await getNewsFeedEntries(redisClient, {
      filterBy: { updatedAt: { from: syncFrom, to: now } },
      pagination: { page: 1, pageSize: 1000 },
      sortBy: {
        updatedAt: 'DESC',
      },
    });

    const affectedKeys = affectedEntries.documents.map((document) => document.id);
    const entriesToAdd = [...itemsToSync[0], ...itemsToSync[1], ...itemsToSync[2], ...itemsToSync[3]];

    if (!affectedKeys.length && !entriesToAdd.length) {
      logger.info('Found no items to delete or add, saving sync to redis and stopping ...');
      await saveSuccessfulSyncToRedis(redisClient, now);
      return;
    }

    const transactionResult = await removeKeysAndSaveNewEntriesAsTransaction(redisClient, affectedKeys, entriesToAdd);
    logger.info('Finished transaction, result:');
    logger.info(transactionResult);

    logger.info('Synchronization completed, saving sync to redis and stopping ...');
    await saveSuccessfulSyncToRedis(redisClient, now);
  } catch (error) {
    logger.error('Synchronization failed, error:');
    logger.error(error);

    if (retry < maxSyncRetries) {
      await sync(retry + 1);
    } else {
      logger.error(`Max synchronization retries (${maxSyncRetries}) exceeded, saving sync to redis and stopping ...`);
      const redisClient = await getRedisClient();
      const syncError = redisError('Sync failed', error as Error);
      await saveNewsFeedSync(redisClient, { errors: [syncError], status: 'Failed', syncedAt: getUnixTimestamp(now) });
    }
  }
};

const saveSuccessfulSyncToRedis = async (redisClient: RedisClient, timestamp: Date) => {
  await saveNewsFeedSync(redisClient, { errors: [], status: 'OK', syncedAt: getUnixTimestamp(timestamp) });
};

const removeKeysAndSaveNewEntriesAsTransaction = async (
  redisClient: RedisClient,
  affectedKeys: string[],
  entriesToAdd: RedisNewsFeedEntry[],
) => {
  return await performRedisTransaction(
    redisClient,
    async (transactionClient) => {
      logger.info(
        `Transaction: Removing news feed entries with the following keys from cache: [${affectedKeys.join(',')}] ...`,
      );
      if (affectedKeys.length) {
        await transactionalDeleteItemsFromRedis(transactionClient, affectedKeys);
      }
      logger.info(`Transaction: Saving ${entriesToAdd.length} news feed entries to cache ...`);
      for (const entry of entriesToAdd) {
        await transactionalSaveNewsFeedEntry(transactionClient, entry);
      }
    },
    { keysToWatch: affectedKeys },
  );
};

const aggregatePosts = async ({ from }: { from: Date }): Promise<RedisNewsFeedEntry[]> => {
  const posts = await getPostsStartingFrom(dbClient, from);
  const mapToRediPosts = posts.map(async (post) => {
    const reactions = await getReactionsForEntity(dbClient, ObjectType.POST, post.id);
    const author = await getInnoUserByProviderId(post.author);
    const followerIds = await getFollowedByForEntity(dbClient, ObjectType.POST, post.id);
    const followers = await mapToRedisUsers(followerIds);
    const responseCount = await countPostResponses(dbClient, post.id);
    return mapToRedisPost({ ...post, author, responseCount }, reactions, followers);
  });
  const redisPosts = await Promise.all(mapToRediPosts);
  return redisPosts.map((post) => ({
    type: NewsType.POST,
    updatedAt: post.updatedAt,
    item: post,
  }));
};

export const aggregateCollaborationComments = async ({ from }: { from: Date }): Promise<RedisNewsFeedEntry[]> => {
  const comments = await getCollaborationCommentStartingFrom(dbClient, from);

  const mapToNewsFeedEntries = comments.map(async (comment) => {
    const question = await getBasicCollaborationQuestionById(comment.questionId);
    if (!question) return null;

    const responseCount = await getCollaborationCommentResponseCount(dbClient, comment.id);
    const reactions = await getReactionsForEntity(dbClient, ObjectType.COLLABORATION_COMMENT, comment.id);
    const author = await getInnoUserByProviderId(comment.author);
    const followerIds = await getFollowedByForEntity(dbClient, ObjectType.COLLABORATION_COMMENT, comment.id);
    const followers = await mapToRedisUsers(followerIds);
    const projectName = await getProjectName(comment.projectId);
    return mapCollaborationCommentToRedisNewsFeedEntry(
      { ...comment, projectName: projectName ?? '', author, responseCount },
      question,
      reactions,
      followers,
    );
  });

  return (await Promise.all(mapToNewsFeedEntries)).filter((entry): entry is RedisNewsFeedEntry => entry !== null);
};

const aggregateProjectUpdates = async ({ from }: { from: Date }): Promise<RedisNewsFeedEntry[]> => {
  const projectUpdates: RedisProjectUpdate[] = await getProjectsUpdates({ from });

  return projectUpdates.map((update) => ({
    type: NewsType.UPDATE,
    updatedAt: update.updatedAt,
    item: update,
  }));
};

const aggregateProjectEvents = async ({ from }: { from: Date }): Promise<RedisNewsFeedEntry[]> => {
  const events: RedisProjectEvent[] = await getProjectsEvents({ from });
  return events.map((event) => ({
    type: NewsType.EVENT,
    updatedAt: event.updatedAt,
    item: event,
  }));
};

const aggregateCollaborationQuestions = async ({ from }: { from: Date }): Promise<RedisNewsFeedEntry[]> => {
  const questions = (await getBasicCollaborationQuestionStartingFromWithAdditionalData(from)) ?? [];
  const mapToRedisQuestions = questions.map(async (question) => {
    const followerIds = await getFollowedByForEntity(dbClient, ObjectType.COLLABORATION_QUESTION, question.id);
    const followers = await mapToRedisUsers(followerIds);
    return mapToRedisCollaborationQuestion(question, question.reactions, followers);
  });
  const redisQuestions = await Promise.all(mapToRedisQuestions);
  return redisQuestions.map((question) => ({
    type: NewsType.COLLABORATION_QUESTION,
    updatedAt: question.updatedAt,
    item: question,
  }));
};
