import { Follow, ObjectType, User } from '@/common/types';
import { addFollowToDb, removeFollowFromDb } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import getLogger from '@/utils/logger';
import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';

import { getNewsFeedEntryForComment } from './collaborationCommentService';
import { getNewsFeedEntryForCollaborationQuestion } from './collaborationQuestionService';
import { getNewsFeedEntryForProjectEvent } from './eventService';
import { getNewsFeedEntryForPost } from './postService';
import { getNewsFeedEntryForProject } from './projectService';
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
  const createdObject = await removeFollowFromDb(dbClient, object.followedBy, object.objectType, object.objectId);
  await removeFollowFromCache({ ...createdObject, objectType: createdObject.objectType as ObjectType }, user);
  return object;
};

export const addFollowToCache = async (object: Follow, user: User) => {
  const redisClient = await getRedisClient();
  const newsFeedEntry = await getItemForEntityWithFollows(object, user);

  if (!newsFeedEntry) {
    return;
  }

  const updatedFollows = newsFeedEntry.item.followedBy.filter((follow) => follow.providerId !== object.followedBy);
  updatedFollows.push(user);
  newsFeedEntry.item.followedBy = updatedFollows;
  await saveNewsFeedEntry(redisClient, newsFeedEntry);
};

export const removeFollowFromCache = async (object: Follow, user: User) => {
  const redisClient = await getRedisClient();
  const newsFeedEntry = await getItemForEntityWithFollows(object, user);

  if (!newsFeedEntry) {
    return;
  }

  const updatedFollows = newsFeedEntry.item.followedBy.filter((follow) => follow.providerId !== object.followedBy);
  newsFeedEntry.item.followedBy = updatedFollows;
  await saveNewsFeedEntry(redisClient, newsFeedEntry);
};

export const getItemForEntityWithFollows = async (object: { objectId: string; objectType: ObjectType }, user: User) => {
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
