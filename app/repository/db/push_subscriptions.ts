import { PrismaClient, PushSubscription } from '@prisma/client';
import webpush, { PushSubscription as WebPushSubscription } from 'web-push';

export const getPushSubscriptionsForUser = async (
  client: PrismaClient,
  userId: string,
): Promise<WebPushSubscription[]> => {
  const pushSubscriptions = await client.pushSubscription.findMany({
    where: {
      userId: {
        equals: userId,
      },
    },
  });

  return pushSubscriptions
    .filter((el) => el.subscription !== undefined)
    .map((pushSubscription) => JSON.parse(JSON.stringify(pushSubscription?.subscription)) as WebPushSubscription);
};

export const createPushSubscriptionForUser = async (
  client: PrismaClient,
  userId: string,
  subscription: PushSubscription,
) =>
  client.pushSubscription.create({
    data: {
      userId,
      subscription,
    },
  });

export const removePushSubscriptionForUser = async (
  client: PrismaClient,
  userId: string,
  subscription: webpush.PushSubscription,
) =>
  client.pushSubscription.deleteMany({
    where: {
      AND: [
        {
          userId: userId,
        },
        {
          subscription: {
            equals: JSON.stringify(subscription),
          },
        },
      ],
    },
  });

export const updatePushSubscriptionForUser = async (
  client: PrismaClient,
  userId: string,
  oldSubscription: webpush.PushSubscription,
  newSubscription: webpush.PushSubscription,
) =>
  client.pushSubscription.updateMany({
    where: {
      AND: [
        {
          userId: userId,
        },
        {
          subscription: {
            equals: JSON.stringify(oldSubscription),
          },
        },
      ],
    },
    data: {
      subscription: JSON.stringify(newSubscription),
    },
  });
