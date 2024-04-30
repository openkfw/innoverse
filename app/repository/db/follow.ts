import { PrismaClient } from '@prisma/client';

export async function getProjectFollowers(client: PrismaClient, projectId: string, limit?: number) {
  const query: any = {
    where: {
      projectId,
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

export async function isProjectFollowedBy(client: PrismaClient, projectId: string, followedBy: string) {
  const followedProjectCount = await client.follow.count({
    where: {
      projectId,
      followedBy,
    },
  });

  return followedProjectCount > 0;
}

export async function deleteProjectAndUserFollower(client: PrismaClient, projectId: string, followedBy: string) {
  return client.follow.deleteMany({
    where: {
      projectId,
      followedBy,
    },
  });
}

export async function addFollower(client: PrismaClient, projectId: string, followedBy: string) {
  return client.follow.upsert({
    where: {
      projectId_followedBy: {
        projectId,
        followedBy,
      },
    },
    update: {
      projectId,
      followedBy,
    },
    create: {
      projectId,
      followedBy,
    },
  });
}
