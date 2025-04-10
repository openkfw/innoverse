import { ObjectType as PrismaObjectType, PrismaClient } from '@prisma/client';

import { ObjectType } from '@/common/types';

export async function getProjectLikes(client: PrismaClient, objectId: string, limit?: number) {
  const query: any = {
    where: {
      objectId,
    },
  };

  if (limit) query.take = limit;

  const res = await client.objectLike.findMany(query);
  return res;
}

export async function getUserLikes(client: PrismaClient, likedBy: string, limit?: number) {
  const query: any = {
    where: {
      likedBy,
    },
  };

  if (limit) query.take = limit;

  return client.objectLike.findMany(query);
}
export async function isObjectLikedBy(client: PrismaClient, objectId: string, likedBy: string) {
  const isLikedByUserCount = await client.objectLike.count({
    where: {
      objectId,
      likedBy,
    },
  });
  return isLikedByUserCount > 0;
}

export async function deleteObjectAndUserLike(client: PrismaClient, objectId: string, likedBy: string) {
  return client.objectLike.deleteMany({
    where: {
      objectId,
      likedBy,
    },
  });
}

export async function addLike(client: PrismaClient, objectId: string, objectType: ObjectType, likedBy: string) {
  return client.objectLike.upsert({
    where: {
      objectId_likedBy: {
        objectId,
        likedBy,
      },
    },
    update: {
      objectId,
      likedBy,
    },
    create: {
      objectId,
      objectType: objectType as PrismaObjectType,
      likedBy,
    },
  });
}
