import { PrismaClient } from '@prisma/client';

export async function getTotalReactions(client: PrismaClient, type: 'UPDATE' | 'EVENT') {
  return client.reaction.groupBy({
    where: { objectType: type },
    by: ['shortCode'],
    _count: true,
  });
}

export async function getTotalProjectLikes(client: PrismaClient, projectId?: string) {
  return client.like.groupBy({
    by: ['projectId'],
    where: projectId ? { projectId } : undefined,
    _count: true,
  });
}

export async function getTotalComments(client: PrismaClient, projectId?: string) {
  return client.projectComment.groupBy({
    by: ['projectId'],
    where: projectId ? { projectId } : undefined,
    _count: true,
  });
}
