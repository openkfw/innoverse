import type { ObjectType as PrismaObjectType } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

import { ObjectType } from '@/common/types';

export async function getTotalReactions(client: PrismaClient, type: ObjectType) {
  return client.reaction.groupBy({
    where: { objectType: type as PrismaObjectType },
    by: ['shortCode'],
    _count: true,
  });
}

export async function getTotalProjectLikes(client: PrismaClient, objectId?: string) {
  return client.objectLike.groupBy({
    by: ['objectId'],
    where: objectId ? { objectId } : undefined,
    _count: true,
  });
}

export async function getTotalComments(client: PrismaClient, objectId?: string) {
  return client.comment.groupBy({
    by: ['objectId'],
    where: objectId ? { objectId } : undefined,
    _count: true,
  });
}
