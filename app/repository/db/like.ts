import { ObjectType, PrismaClient } from '@prisma/client';

export async function getProjectLikes(client: PrismaClient, projectId: string, limit?: number) {
  const query: any = {
    where: {
      projectId,
    },
  };

  if (limit) query.take = limit;

  const res = await client.like.findMany(query);
  return res;
}

export async function getUserLikes(client: PrismaClient, likedBy: string, limit?: number) {
  const query: any = {
    where: {
      likedBy,
    },
  };

  if (limit) query.take = limit;

  return client.like.findMany(query);
}
export async function isObjectLikedBy(client: PrismaClient, objectId: string, likedBy: string) {
  const isLikedByUserCount = await client.like.count({
    where: {
      objectId,
      likedBy,
    },
  });
  return isLikedByUserCount > 0;
}

export async function deleteObjectAndUserLike(client: PrismaClient, objectId: string, likedBy: string) {
  return client.like.deleteMany({
    where: {
      objectId,
      likedBy,
    },
  });
}

export async function addLike(client: PrismaClient, objectId: string, objectType: ObjectType, likedBy: string) {
  return client.like.upsert({
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
      objectType,
      likedBy,
    },
  });
}
