import { PrismaClient } from '@prisma/client';

export async function getProjectLikes(client: PrismaClient, projectId: string, limit?: number) {
  const query: any = {
    where: {
      projectId: projectId,
    },
  };

  if (limit) query.take = limit;

  return client.like.findMany(query);
}

export async function getUserLikes(client: PrismaClient, likedBy: string, limit?: number) {
  const query: any = {
    where: {
      likedBy: likedBy,
    },
  };

  if (limit) query.take = limit;

  return client.like.findMany(query);
}
export async function getProjectAndUserLikes(client: PrismaClient, projectId: string, likedBy: string) {
  return client.like.findMany({
    where: {
      projectId: projectId,
      likedBy: likedBy,
    },
  });
}

export async function deleteProjectAndUserLike(client: PrismaClient, projectId: string, likedBy: string) {
  return client.like.deleteMany({
    where: {
      projectId: projectId,
      likedBy: likedBy,
    },
  });
}

export async function addLike(client: PrismaClient, projectId: string, likedBy: string) {
  return client.like.create({
    data: {
      projectId,
      likedBy,
    },
  });
}
