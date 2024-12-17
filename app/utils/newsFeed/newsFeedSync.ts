import dayjs from 'dayjs';

import { ObjectType } from '@/common/types';
import { getCommentsStartingFrom } from '@/repository/db/comment';
import { getFollowedByForEntity } from '@/repository/db/follow';
import { getPostsStartingFrom } from '@/repository/db/posts';
import dbClient from '@/repository/db/prisma/prisma';
import { createNewsFeedEntryForComment } from '@/services/collaborationCommentService';
import { createNewsFeedEntryForEvent } from '@/services/eventService';
import { createNewsFeedEntryForPost } from '@/services/postService';
import { createNewsFeedEntryForProject } from '@/services/projectService';
import { createNewsFeedEntryForSurveyQuestion } from '@/services/surveyQuestionService';
import { createNewsFeedEntryForProjectUpdate } from '@/services/updateService';
import { redisError } from '@/utils/errors';
import { fetchPages, getPromiseResults, getUnixTimestamp, unixTimestampToDate } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapCollaborationQuestionToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { RedisNewsFeedEntry, RedisSync } from '@/utils/newsFeed/redis/models';
import { getRedisClient, RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { getBasicCollaborationQuestionStartingFromWithAdditionalData } from '@/utils/requests/collaborationQuestions/requests';
import { getProjectsStartingFrom } from '@/utils/requests/project/requests';

import { mapToComment } from '../requests/comments/mapping';
import { getEventsStartingFrom } from '../requests/events/requests';
import { getSurveyQuestionsStartingFrom } from '../requests/surveyQuestions/requests';
import { getProjectUpdatesStartingFrom } from '../requests/updates/requests';

import {
  getLatestSuccessfulNewsFeedSync,
  getNewsFeedEntries,
  performRedisTransaction,
  saveNewsFeedSync,
  transactionalDeleteItemsFromRedis,
  transactionalSaveNewsFeedEntry,
} from './redis/redisService';

const logger = getLogger();
const maxSyncRetries = 3;

export const sync = async (retry?: number): Promise<RedisSync> => {
  const now = new Date();
  retry ??= 0;

  try {
    logger.info(`Starting news feed synchronization at ${now.toISOString()} (retry: ${retry}) ...`);
    const redisClient = await getRedisClient();
    const lastSync = await getLatestSuccessfulNewsFeedSync(redisClient);
    const syncFrom = lastSync ? unixTimestampToDate(lastSync.syncedAt) : dayjs(now).subtract(6, 'months').toDate();

    logger.info(`Sync news feed items starting from ${syncFrom.toISOString()} ...`);

    const getItems = [
      aggregateProjects({ from: syncFrom }),
      aggregateSurveyQuestions({ from: syncFrom }),
      aggregateProjectUpdates({ from: syncFrom }),
      aggregateProjectEvents({ from: syncFrom }),
      aggregatePosts({ from: syncFrom }),
      aggregateCollaborationQuestions({ from: syncFrom }),
      aggregateCollaborationComments({ from: syncFrom }),
    ];

    const settledItems = await Promise.allSettled(getItems);
    const itemsToSync = settledItems
      .filter((result): result is PromiseFulfilledResult<RedisNewsFeedEntry[]> => result.status === 'fulfilled')
      .map((result) => result.value);

    const failedItemsToSync = settledItems.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );

    if (failedItemsToSync.length) {
      logger.warn('Failed to load items for sync:', failedItemsToSync);
    }

    const affectedKeys = await getNewsFeedEntryKeys({ redisClient, from: syncFrom, to: now });
    const entriesToAdd = itemsToSync.flatMap((items) => items);

    if (!affectedKeys.length && !entriesToAdd.length) {
      logger.info('Found no items to delete or add, saving sync to redis and stopping ...');
      const sync = createSuccessfulSync(now, 0);
      await saveNewsFeedSync(redisClient, sync);
      return sync;
    }

    const transactionResult = await removeKeysAndSaveNewEntriesAsTransaction(redisClient, affectedKeys, entriesToAdd);
    logger.info('Finished transaction, result:');
    logger.info(transactionResult);

    logger.info('Synchronization completed, saving sync to redis and stopping ...');
    const sync = createSuccessfulSync(now, entriesToAdd.length);
    await saveNewsFeedSync(redisClient, sync);
    return sync;
  } catch (error) {
    logger.error('Synchronization failed, error:');
    logger.error(error);

    if (retry < maxSyncRetries) {
      return await sync(retry + 1);
    } else {
      logger.error(`Max synchronization retries (${maxSyncRetries}) exceeded, saving sync to redis and stopping ...`);
      const redisClient = await getRedisClient();
      const syncError = redisError('Sync failed', error as Error);
      const sync: RedisSync = { errors: [syncError], status: 'Failed', syncedAt: getUnixTimestamp(now) };
      await saveNewsFeedSync(redisClient, sync);
      return sync;
    }
  }
};

const getNewsFeedEntryKeys = async ({ redisClient, from, to }: { redisClient: RedisClient; from: Date; to: Date }) => {
  return await fetchPages({
    fetcher: async (page, pageSize) => {
      logger.info(`Fetching page ${page} of news feed entry keys from ${from} to ${to} ...`);
      const entries = await getNewsFeedEntries(redisClient, {
        filterBy: { updatedAt: { from, to } },
        pagination: { page, pageSize },
        sortBy: {
          updatedAt: 'DESC',
        },
      });
      const keys = entries.documents.map((document) => document.id);
      return keys;
    },
  });
};

const createSuccessfulSync = (timestamp: Date, syncedItemCount: number): RedisSync => {
  return { status: 'OK', syncedAt: getUnixTimestamp(timestamp), syncedItemCount, errors: [] };
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
  // posts fetched from prisma, hence no pagination required
  const posts = await getPostsStartingFrom(dbClient, from);
  if (posts.length === 0) {
    logger.info('No posts found to sync');
  }
  const mapEntries = posts.map(async (post) => createNewsFeedEntryForPost(post));
  const newsFeedEntries = await getPromiseResults(mapEntries);
  return newsFeedEntries.filter((entry): entry is RedisNewsFeedEntry => entry !== null);
};

export const aggregateCollaborationComments = async ({ from }: { from: Date }): Promise<RedisNewsFeedEntry[]> => {
  // collaboration comments fetched from prisma, hence no pagination required
  const comments = await getCommentsStartingFrom(dbClient, from, ObjectType.COMMENT); //todo check if type is COMMENT or a new type is needed
  if (comments.length === 0) {
    logger.info('No collaboration comments found to sync');
  }
  const mapToNewsFeedEntries = comments.map(async (comment) =>
    createNewsFeedEntryForComment(await mapToComment(comment)),
  );
  const newsFeedEntries = await getPromiseResults(mapToNewsFeedEntries);
  return newsFeedEntries.filter((entry): entry is RedisNewsFeedEntry => entry !== null);
};

const aggregateProjectUpdates = async ({ from }: { from: Date }): Promise<RedisNewsFeedEntry[]> => {
  const projectUpdates = await fetchPages({
    fetcher: async (page, pageSize) => {
      return (await getProjectUpdatesStartingFrom({ from, page, pageSize })) ?? [];
    },
  });

  const createdProjectUpdates = projectUpdates.map((update) => createNewsFeedEntryForProjectUpdate(update));
  const newsFeedEntries = await getPromiseResults(createdProjectUpdates);
  return newsFeedEntries;
};

const aggregateProjectEvents = async ({ from }: { from: Date }): Promise<RedisNewsFeedEntry[]> => {
  const events = await fetchPages({
    fetcher: async (page, pageSize) => {
      return (await getEventsStartingFrom({ from, page, pageSize })) ?? [];
    },
  });

  const createdEvents = events.map((event) => createNewsFeedEntryForEvent(event));
  const newsFeedEntries = await getPromiseResults(createdEvents);
  return newsFeedEntries;
};

const aggregateProjects = async ({ from }: { from: Date }): Promise<RedisNewsFeedEntry[]> => {
  const projects = await fetchPages({
    fetcher: async (page, pageSize) => {
      const projectsPage = (await getProjectsStartingFrom({ from, page, pageSize })) ?? [];
      return projectsPage;
    },
  });

  const createdProjects = projects.map((project) => createNewsFeedEntryForProject(project));
  const newsFeedEntries = await getPromiseResults(createdProjects);
  return newsFeedEntries;
};

const aggregateSurveyQuestions = async ({ from }: { from: Date }): Promise<RedisNewsFeedEntry[]> => {
  const surveys = await fetchPages({
    fetcher: async (page, pageSize) => {
      return (await getSurveyQuestionsStartingFrom({ from, page, pageSize })) ?? [];
    },
  });

  const createNewsFeedEntries = surveys.map((survey) => createNewsFeedEntryForSurveyQuestion(survey));
  const newsFeedEntries = await getPromiseResults(createNewsFeedEntries);
  return newsFeedEntries;
};

const aggregateCollaborationQuestions = async ({ from }: { from: Date }): Promise<RedisNewsFeedEntry[]> => {
  const questions = await fetchPages({
    fetcher: async (page, pageSize) => {
      return (await getBasicCollaborationQuestionStartingFromWithAdditionalData({ from, page, pageSize })) ?? [];
    },
  });

  const mapToRedisNewsFeedEntries = questions.map(async (question) => {
    const followerIds = await getFollowedByForEntity(dbClient, ObjectType.COLLABORATION_QUESTION, question.id);
    const followers = await mapToRedisUsers(followerIds);
    return mapCollaborationQuestionToRedisNewsFeedEntry(question, question.reactions, followers);
  });

  const newsFeedEntries = await getPromiseResults(mapToRedisNewsFeedEntries);
  return newsFeedEntries;
};
