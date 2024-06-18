import type { Follow, ObjectType as PrismaObjectType } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

import { ObjectType } from '@/common/types';

export async function getFollowers(client: PrismaClient, objectType: ObjectType, objectId: string, limit?: number) {
  const query: any = {
    where: {
      objectId,
      objectType,
    },
  };

  if (limit) query.take = limit;

  return client.follow.findMany(query);
}

export async function getProjectFollowers(client: PrismaClient, objectId: string, limit?: number) {
  const query: any = {
    where: {
      objectId,
      objectType: ObjectType.PROJECT,
    },
  };

  if (limit) query.take = limit;

  return client.follow.findMany(query);
}

export async function getUserFollowers(client: PrismaClient, followedBy: string, limit?: number) {
  const query: any = {
    where: {
      followedBy,
    },
  };

  if (limit) query.take = limit;

  return client.follow.findMany(query);
}

export async function isFollowedBy(client: PrismaClient, objectType: ObjectType, objectId: string, followedBy: string) {
  const followedObjectCount = await client.follow.count({
    where: {
      objectId,
      objectType: objectType as PrismaObjectType,
      followedBy,
    },
  });

  return followedObjectCount > 0;
}

export async function isProjectFollowedBy(client: PrismaClient, objectId: string, followedBy: string) {
  const followedObjectCount = await client.follow.count({
    where: {
      objectId,
      objectType: ObjectType.PROJECT,
      followedBy,
    },
  });

  return followedObjectCount > 0;
}

export async function removeFollowFromDb(
  client: PrismaClient,
  followedBy: string,
  objectType: ObjectType,
  objectId: string,
): Promise<Follow> {
  return await client.follow.delete({
    where: {
      objectId_objectType_followedBy: {
        followedBy,
        objectId,
        objectType: objectType as PrismaObjectType,
      },
    },
  });
}

export async function addFollowToDb(
  client: PrismaClient,
  followedBy: string,
  objectType: ObjectType,
  objectId: string,
) {
  return client.follow.upsert({
    where: {
      objectId_objectType_followedBy: {
        objectId,
        objectType: objectType as PrismaObjectType,
        followedBy,
      },
    },
    update: {
      objectId,
      objectType: objectType as PrismaObjectType,
      followedBy,
    },
    create: {
      objectId,
      objectType: objectType as PrismaObjectType,
      followedBy,
    },
  });
}

export async function getFollowedByForEntity(
  client: PrismaClient,
  objectType: ObjectType,
  objectId: string,
): Promise<string[]> {
  const followedBy = await client.follow.findMany({
    where: {
      objectId,
      objectType: objectType as PrismaObjectType,
    },
    select: {
      followedBy: true,
    },
  });
  return followedBy.map((follow) => follow.followedBy);
}
