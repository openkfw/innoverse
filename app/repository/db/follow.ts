import type { Follow, ObjectType as PrismaObjectType } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

import { ObjectType } from '@/common/types';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

const logger = getLogger();

export async function getFollowers(client: PrismaClient, objectType: ObjectType, objectId: string, limit?: number) {
  const query: any = {
    where: {
      objectId,
      objectType: objectType as PrismaObjectType,
    },
  };

  if (limit) query.take = limit;

  return client.follow.findMany(query);
}

export async function getFollowedByForEntity(
  client: PrismaClient,
  objectType: ObjectType,
  objectId: string,
): Promise<string[]> {
  try {
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
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Get follower for ${objectType} object with id: ${objectId}`,
      err as Error,
      objectId,
    );
    logger.error(error);
    throw err;
  }
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

export async function findFollowedObjectIds(
  client: PrismaClient,
  objectType: ObjectType,
  objectIds: string[],
  followedBy: string,
) {
  const followedObjects = await client.follow.findMany({
    where: {
      objectId: { in: objectIds },
      objectType: objectType as PrismaObjectType,
      followedBy,
    },
    select: { objectId: true },
  });

  return followedObjects.map((object) => object.objectId);
}

export async function isFollowedBy(client: PrismaClient, objectType: ObjectType, objectId: string, followedBy: string) {
  try {
    const followedObjectCount = await client.follow.count({
      where: {
        objectId,
        objectType: objectType as PrismaObjectType,
        followedBy,
      },
    });

    return followedObjectCount > 0;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Check if object with id: ${objectId} of type: ${objectType} is followed by user: ${followedBy}`,
      err as Error,
      objectId,
    );
    logger.error(error);
    throw err;
  }
}

export async function isProjectFollowedBy(client: PrismaClient, objectId: string, followedBy: string) {
  try {
    const followedObjectCount = await client.follow.count({
      where: {
        objectId,
        objectType: ObjectType.PROJECT,
        followedBy,
      },
    });
    return followedObjectCount > 0;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Check if project with id: ${objectId} is followed by user: ${followedBy}`,
      err as Error,
      objectId,
    );
    logger.error(error);
    throw err;
  }
}

export async function removeFollowFromDb(
  client: PrismaClient,
  followedBy: string,
  objectType: ObjectType,
  objectId: string,
): Promise<Follow> {
  try {
    return await client.follow.delete({
      where: {
        objectId_objectType_followedBy: {
          followedBy,
          objectId,
          objectType: objectType as PrismaObjectType,
        },
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Remove follow to ${objectType} object with id: ${objectId}`,
      err as Error,
      objectId,
    );
    logger.error(error);
    throw err;
  }
}

export async function removeAllFollowsByObjectIdAndType(
  client: PrismaClient,
  objectId: string,
  objectType: ObjectType,
) {
  try {
    const result = await client.follow.deleteMany({
      where: {
        objectId,
        objectType: objectType as PrismaObjectType,
      },
    });
    return result.count;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Remove all follows by object with id: ${objectId} and type: ${objectType}`,
      err as Error,
      objectId,
    );
    logger.error(error);
    throw err;
  }
}

export async function addFollowToDb(
  client: PrismaClient,
  followedBy: string,
  objectType: ObjectType,
  objectId: string,
) {
  try {
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
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Add follow to ${objectType} object with id: ${objectId}`,
      err as Error,
      objectId,
    );
    logger.error(error);
    throw err;
  }
}

export async function getFollowsForUserIds(client: PrismaClient, objectType: PrismaObjectType, userIds: string[]) {
  return client.follow.findMany({
    where: {
      objectType: objectType,
      followedBy: { in: userIds },
    },
  });
}
