import { ObjectType } from '@/common/types';
import { PrismaClient } from '@prisma/client';
import type { ObjectType as PrismaObjectType } from '@prisma/client';

export async function getTotalReactions(client: PrismaClient, type: ObjectType) {
  return client.reaction.groupBy({
    where: { objectType: type as PrismaObjectType },
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
