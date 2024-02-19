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

export async function addUserReactionOnEvent(
  client: PrismaClient,
  reactedBy: string,
  eventId: string,
  reactionShortCode: string,
) {
  return await client.userReactionOnEvent.upsert({
    where: {
      compositeID: {
        reactedBy: reactedBy,
        eventId: eventId,
      },
    },
    update: {
      reactionShortCode: reactionShortCode,
    },
    create: {
      reactionShortCode: reactionShortCode,
      eventId: eventId,
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

export async function removeUserReactionOnUpdate(client: PrismaClient, updateId: string, reactedBy: string) {
  return await client.userReactionOnUpdate.delete({
    where: {
      compositeID: {
        reactedBy: reactedBy,
        updateId: updateId,
      },
    },
  });
}

export async function removeUserReactionOnEvent(client: PrismaClient, eventId: string, reactedBy: string) {
  return await client.userReactionOnEvent.delete({
    where: {
      compositeID: {
        reactedBy: reactedBy,
        eventId: eventId,
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

export async function getEventAndUserReaction(client: PrismaClient, eventId: string, reactedBy: string) {
  return client.userReactionOnEvent.findFirst({
    where: {
      reactedBy: reactedBy,
      eventId: eventId,
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

export async function getReactionsByShortCodes(client: PrismaClient, shortCodes: string[]) {
  return client.reaction.findMany({
    where: {
      shortCode: { in: shortCodes },
    },
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

export async function countNumberOfReactionsOnEventPerEmoji(client: PrismaClient, eventId: string) {
  return client.userReactionOnEvent.groupBy({
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
      eventId: eventId,
    },
  });
}
