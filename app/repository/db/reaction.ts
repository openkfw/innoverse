import type { ObjectType as PrismaObjectType, Reaction } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

import { ObjectType } from '@/common/types';

export type ReactionObjectType = 'UPDATE' | 'EVENT' | 'COLLABORATION_COMMENT' | 'COLLABORATION_QUESTION';

export async function addReactionToDb(
  client: PrismaClient,
  reactedBy: string,
  objectType: ObjectType,
  objectId: string,
  shortCode: string,
  nativeSymbol: string,
) {
  return await client.reaction.upsert({
    where: {
      reactedBy_objectId_objectType: {
        reactedBy,
        objectId,
        objectType: objectType as PrismaObjectType,
      },
    },
    update: {
      shortCode,
      nativeSymbol,
    },
    create: {
      objectId,
      objectType: objectType as PrismaObjectType,
      reactedBy,
      shortCode,
      nativeSymbol,
    },
  });
}

export async function removeReactionFromDb(
  client: PrismaClient,
  reactedBy: string,
  objectType: ObjectType,
  objectId: string,
): Promise<Reaction> {
  return await client.reaction.delete({
    where: {
      reactedBy_objectId_objectType: {
        reactedBy,
        objectId,
        objectType: objectType as PrismaObjectType,
      },
    },
  });
}

export async function findReaction(
  client: PrismaClient,
  reactedBy: string,
  objectType: ObjectType,
  objectId: string,
): Promise<Reaction | null> {
  return await client.reaction.findUnique({
    where: {
      reactedBy_objectId_objectType: {
        reactedBy,
        objectId,
        objectType: objectType as PrismaObjectType,
      },
    },
  });
}

export async function getReactionsForEntity(
  client: PrismaClient,
  objectType: ObjectType,
  objectId: string,
): Promise<Reaction[]> {
  return await client.reaction.findMany({
    where: {
      objectId,
      objectType: objectType as PrismaObjectType,
    },
  });
}

export async function countNumberOfReactions(client: PrismaClient, objectType: ObjectType, objectId: string) {
  return await client.reaction.groupBy({
    by: ['shortCode', 'nativeSymbol'],
    _count: {
      shortCode: true,
    },
    orderBy: {
      _count: {
        shortCode: 'desc',
      },
    },
    where: {
      objectId,
      objectType: objectType as PrismaObjectType,
    },
  });
}
