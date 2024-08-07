import { Follow, ObjectType, User } from '@/common/types';
import { addFollowToDb, removeFollowFromDb } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import getLogger from '@/utils/logger';
import { RedisNewsFeedEntry } from '@/utils/newsFeed/redis/models';
import { getRedisClient, RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';

import { getNewsFeedEntryForComment } from './collaborationCommentService';
import { getNewsFeedEntryForCollaborationQuestion } from './collaborationQuestionService';
import { getNewsFeedEntryForProjectEvent } from './eventService';
import { getNewsFeedEntryForPost } from './postService';
import { getNewsFeedEntriesForProject, getNewsFeedEntryForProject } from './projectService';
import { getNewsFeedEntryForProjectUpdate } from './updateService';

const logger = getLogger();

type AddFollow = {
  user: User;
  object: {
    followedBy: string;
    objectId: string;
    objectType: ObjectType;
  };
};

type RemoveFollow = {
  user: User;
  object: {
    followedBy: string;
    objectId: string;
    objectType: ObjectType;
  };
};

export const addFollow = async ({ user, object }: AddFollow) => {
  const createdObject = await addFollowToDb(dbClient, object.followedBy, object.objectType, object.objectId);
  await addFollowToCache({ ...createdObject, objectType: createdObject.objectType as ObjectType }, user);
  return object;
};

export const removeFollow = async ({ user, object }: RemoveFollow) => {
  const removedObject = await removeFollowFromDb(dbClient, object.followedBy, object.objectType, object.objectId);
  await removeFollowFromCache({ ...removedObject, objectType: removedObject.objectType as ObjectType }, user);
  return object;
};

export const addFollowToCache = async (follow: Follow, user: User) => {
  if (follow.objectType === ObjectType.PROJECT) {
    const projectId = follow.objectId;
    await followNewsFeedEntriesWithProject({ projectId, user });
    return;
  }

  const newsFeedEntry = await getNewsFeedEntry(follow, user);

  if (newsFeedEntry) {
    const redisClient = await getRedisClient();
    return await addFollowToCacheForNewsFeedEntry(redisClient, newsFeedEntry, user);
  }
};

export const removeFollowFromCache = async (follow: Follow, user: User) => {
  if (follow.objectType === ObjectType.PROJECT) {
    const projectId = follow.objectId;
    await unfollowNewsFeedEntriesWithProject({ projectId, user });
    return;
  }

  const newsFeedEntry = await getNewsFeedEntry(follow, user);

  if (newsFeedEntry) {
    const redisClient = await getRedisClient();
    await removeFollowFromCacheForNewsFeedEntry(redisClient, newsFeedEntry, user);
  }
};

export const getNewsFeedEntry = async (object: { objectId: string; objectType: ObjectType }, user: User) => {
  const redisClient = await getRedisClient();
  switch (object.objectType) {
    case ObjectType.EVENT:
      return await getNewsFeedEntryForProjectEvent(redisClient, object.objectId);
    case ObjectType.UPDATE:
      return await getNewsFeedEntryForProjectUpdate(redisClient, object.objectId);
    case ObjectType.COLLABORATION_COMMENT:
      return await getNewsFeedEntryForComment(redisClient, { user, commentId: object.objectId });
    case ObjectType.COLLABORATION_QUESTION:
      return await getNewsFeedEntryForCollaborationQuestion(redisClient, object.objectId);
    case ObjectType.POST:
      return await getNewsFeedEntryForPost(redisClient, { user, postId: object.objectId });
    case ObjectType.PROJECT:
      return await getNewsFeedEntryForProject(redisClient, { projectId: object.objectId });
    default:
      logger.warn(`Could not add follow to news feed cache: Unknown object type '${object.objectId}'`);
      return null;
  }
};

const followNewsFeedEntriesWithProject = async ({ projectId, user }: { projectId: string; user: User }) => {
  const redisClient = await getRedisClient();
  const newsFeedEntries = await getNewsFeedEntriesForProject(redisClient, { projectId });
  newsFeedEntries?.forEach(async (entry) => await addFollowToCacheForNewsFeedEntry(redisClient, entry, user));
};

const unfollowNewsFeedEntriesWithProject = async ({ projectId, user }: { projectId: string; user: User }) => {
  const redisClient = await getRedisClient();
  const projectNewsFeedEntries = await getNewsFeedEntriesForProject(redisClient, { projectId });
  projectNewsFeedEntries.forEach(
    async (entry) => await removeFollowFromCacheForNewsFeedEntry(redisClient, entry, user),
  );
};

const addFollowToCacheForNewsFeedEntry = async (
  redisClient: RedisClient,
  newsFeedEntry: RedisNewsFeedEntry,
  user: User,
) => {
  const updatedFollows =
    newsFeedEntry.item.followedBy?.filter((follower) => follower.providerId !== user.providerId) ?? [];

  updatedFollows.push(user);
  newsFeedEntry.item.followedBy = updatedFollows;
  await saveNewsFeedEntry(redisClient, newsFeedEntry);
};

const removeFollowFromCacheForNewsFeedEntry = async (
  redisClient: RedisClient,
  entry: RedisNewsFeedEntry,
  user: User,
) => {
  entry.item.followedBy = entry.item.followedBy.filter((follower) => follower.providerId !== user.providerId);
  await saveNewsFeedEntry(redisClient, entry);
};
