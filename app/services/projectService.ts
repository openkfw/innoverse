'use server';

import { BasicProject, ObjectType } from '@/common/types';
import { getFollowedByForEntity } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import getLogger from '@/utils/logger';

import { mapProjectToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { NewsType } from '@/utils/newsFeed/redis/models';
import { RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { getNewsFeedEntryByKey } from '@/utils/newsFeed/redis/redisService';
import { getProjectById } from '@/utils/requests/project/requests';

const logger = getLogger();

export const getNewsFeedEntryForProject = async (redisClient: RedisClient, { projectId }: { projectId: string }) => {
  const redisKey = getRedisKey(projectId);
  const cacheEntry = await getNewsFeedEntryByKey(redisClient, redisKey);
  return cacheEntry ?? (await createNewsFeedEntryForProjectById(projectId));
};

export const createNewsFeedEntryForProjectById = async (objectId: string) => {
  const project = await getProjectById(objectId);

  if (!project) {
    logger.warn(`Failed to create news feed cache entry for project with id '${objectId}'`);
    return null;
  }
  return await createNewsFeedEntryForProject(project);
};

export const createNewsFeedEntryForProject = async (project: BasicProject) => {
  const projectReactions = await getReactionsForEntity(dbClient, ObjectType.PROJECT, project.id);
  const projectFollowedBy = await getFollowedByForEntity(dbClient, ObjectType.PROJECT, project.id);
  const mappedProjectFollowedBy = await mapToRedisUsers(projectFollowedBy);
  return mapProjectToRedisNewsFeedEntry(project, projectReactions, mappedProjectFollowedBy);
};

const getRedisKey = (id: string) => `${NewsType.PROJECT}:${id}`;