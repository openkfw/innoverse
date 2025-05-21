'use server';

import { Event, ObjectType } from '@/common/types';
import { getFollowedByForEntity } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import getLogger from '@/utils/logger';
import { mapEventToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { NewsType } from '@/utils/newsFeed/redis/models';
import { RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { getNewsFeedEntryByKey } from '@/utils/newsFeed/redis/redisService';
import { getCommentsByObjectIdWithResponses } from '@/utils/requests/comments/requests';
import { getEventById } from '@/utils/requests/events/requests';

const logger = getLogger();

export const getNewsFeedEntryForProjectEvent = async (redisClient: RedisClient, eventId: string) => {
  const redisKey = getRedisKey(eventId);
  const cacheEntry = await getNewsFeedEntryByKey(redisClient, redisKey);
  return cacheEntry ?? (await createNewsFeedEntryForEventById(eventId));
};

const createNewsFeedEntryForEventById = async (eventId: string) => {
  const event = await getEventById(eventId);
  if (!event) {
    logger.warn(`Failed to create news feed cache entry for event with id '${eventId}': Event not found`);
    return null;
  }
  return await createNewsFeedEntryForEvent(event);
};

export const createNewsFeedEntryForEvent = async (event: Event) => {
  const { comments } = await getCommentsByObjectIdWithResponses(event.id, ObjectType.EVENT);
  const eventReactions = await getReactionsForEntity(dbClient, ObjectType.EVENT, event.id);
  const projectFollowedBy = await mapToRedisUsers(
    await getFollowedByForEntity(dbClient, ObjectType.PROJECT, event.projectId),
  );
  return mapEventToRedisNewsFeedEntry(event, eventReactions, projectFollowedBy, comments);
};

const getRedisKey = (eventId: string) => `${NewsType.EVENT}:${eventId}`;
