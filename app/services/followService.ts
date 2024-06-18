import { ObjectType, User, Follow } from '@/common/types';
import dbClient from '@/repository/db/prisma/prisma';
import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';
import { getNewsFeedEntryForEntity } from './commonService';
import { addFollowToDb, removeFollowFromDb } from '@/repository/db/follow';

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
  const newsFeedEntry = await getNewsFeedEntryForEntity(redisClient, object, user);

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
  const newsFeedEntry = await getNewsFeedEntryForEntity(redisClient, object, user);

  if (!newsFeedEntry) {
    return;
  }

  const updatedFollows = newsFeedEntry.item.followedBy.filter((follow) => follow.providerId !== object.followedBy);
  newsFeedEntry.item.followedBy = updatedFollows;
  await saveNewsFeedEntry(redisClient, newsFeedEntry);
};
