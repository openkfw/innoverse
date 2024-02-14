import { PrismaClient } from '@prisma/client';

export async function addUserReactionOnUpdate(
  client: PrismaClient,
  reactedBy: string,
  updateId: string,
  reactionShortCode: string,
) {
  return await client.userReactionOnUpdate.upsert({
    where: {
      compositeID: {
        reactedBy: reactedBy,
        updateId: updateId,
      },
    },
    update: {
      reactionShortCode: reactionShortCode,
    },
    create: {
      reactionShortCode: reactionShortCode,
      updateId: updateId,
      reactedBy: reactedBy,
    },
  });
}

export async function addReaction(client: PrismaClient, shortCode: string, nativeSymbol: string) {
  return await client.reaction.upsert({
    where: {
      shortCode: shortCode,
    },
    update: {},
    create: {
      shortCode: shortCode,
      nativeSymbol: nativeSymbol,
    },
  });
}

export async function removeReaction(client: PrismaClient, updateId: string, reactedBy: string) {
  return await client.userReactionOnUpdate.delete({
    where: {
      compositeID: {
        reactedBy: reactedBy,
        updateId: updateId,
      },
    },
  });
}

export async function getUpdateAndUserReaction(client: PrismaClient, updateId: string, reactedBy: string) {
  return client.userReactionOnUpdate.findFirst({
    where: {
      reactedBy: reactedBy,
      updateId: updateId,
    },
    include: {
      reactedWith: true,
    },
  });
}

export async function findReactionsByUpdate(client: PrismaClient, updateId: string, limit?: number) {
  return await client.userReactionOnUpdate.findMany({
    where: {
      updateId: updateId,
    },
    include: {
      reactedWith: true,
    },
    take: limit,
  });
}

export async function countNumberOfReactionsOnUpdatePerEmoji(client: PrismaClient, updateId: string) {
  return client.userReactionOnUpdate.groupBy({
    by: ['reactionShortCode'],
    _count: {
      reactionShortCode: true,
    },
    orderBy: {
      _count: {
        reactionShortCode: 'desc',
      },
    },
    where: {
      updateId: updateId,
    },
  });
}
