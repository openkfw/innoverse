import { PrismaClient } from '@prisma/client';

export async function addReaction(
  client: PrismaClient,
  reactedBy: string,
  objectType: 'UPDATE' | 'EVENT',
  objectId: string,
  shortCode: string,
  nativeSymbol: string,
) {
  return await client.reaction.upsert({
    where: {
      reactedBy_objectId_objectType: {
        reactedBy,
        objectId,
        objectType,
      },
    },
    update: {
      shortCode,
      nativeSymbol,
    },
    create: {
      objectId,
      objectType,
      reactedBy,
      shortCode,
      nativeSymbol,
    },
  });
}

export async function removeReaction(
  client: PrismaClient,
  reactedBy: string,
  objectType: 'UPDATE' | 'EVENT',
  objectId: string,
) {
  return await client.reaction.delete({
    where: {
      reactedBy_objectId_objectType: {
        reactedBy,
        objectId,
        objectType,
      },
    },
  });
}

export async function findReaction(
  client: PrismaClient,
  reactedBy: string,
  objectType: 'UPDATE' | 'EVENT',
  objectId: string,
) {
  return await client.reaction.findUnique({
    where: {
      reactedBy_objectId_objectType: {
        reactedBy,
        objectId,
        objectType,
      },
    },
  });
}

export async function countNumberOfReactions(client: PrismaClient, objectType: 'UPDATE' | 'EVENT', objectId: string) {
  return client.reaction.groupBy({
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
      objectType,
    },
  });
}
