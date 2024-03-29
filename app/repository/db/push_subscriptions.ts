import { PrismaClient, PushSubscription } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import webpush, { PushSubscription as WebPushSubscription } from 'web-push';

const parsePrismaJsonValue = <T>(jsonValue: JsonValue) => {
  const json = jsonValue?.toString();
  return json ? (JSON.parse(json) as T) : undefined;
};

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
    .map((el) => parsePrismaJsonValue<WebPushSubscription>(el.subscription))
    .filter((subscription): subscription is WebPushSubscription => subscription !== undefined);
};

export const getAllPushSubscriptions = async (
  client: PrismaClient,
): Promise<
  {
    userId: string;
    subscriptions: WebPushSubscription[];
  }[]
> => {
  const pushSubscriptions = await client.pushSubscription.findMany();

  return pushSubscriptions.map((pushSubscription) => {
    const subscription = parsePrismaJsonValue<WebPushSubscription>(pushSubscription.subscription);
    const subscriptions = subscription ? [subscription] : [];
    return {
      userId: pushSubscription.userId,
      subscriptions: subscriptions,
    };
  });
};

export const createPushSubscriptionForUser = async (
  client: PrismaClient,
  userId: string,
  subscription: PushSubscription,
) =>
  client.pushSubscription.create({
    data: {
      userId,
      subscription: JSON.stringify(subscription),
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
