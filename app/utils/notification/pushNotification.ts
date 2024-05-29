'use server';

import { StatusCodes } from 'http-status-codes';
import webpush, { PushSubscription as WebPushSubscription, WebPushError } from 'web-push';

import { UserSession } from '@/common/types';
import { clientConfig } from '@/config/client';
import { serverConfig } from '@/config/server';
import { createPushSubscriptionForUser, removePushSubscriptionForUser } from '@/repository/db/push_subscriptions';
import { PushNotification } from '@/types/notification';
import { withAuth } from '@/utils/auth';

import dbClient from '../../repository/db/prisma/prisma';
import getLogger from '../logger';

const logger = getLogger();

webpush.setVapidDetails(
  serverConfig.VAPID_ADMIN_EMAIL,
  clientConfig.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  serverConfig.VAPID_PRIVATE_KEY,
);

export const sendPushNotification = async (subscription: WebPushSubscription, pushNotification: PushNotification) => {
  const { type, userId, topic, title, body, urgency, icon, ttl, url } = pushNotification;
  if (type !== 'push') {
    console.error('Can not send push notification, type is not push notification!');
  }
  const payload = JSON.stringify({
    title,
    body,
    icon,
    url,
  });
  const options = {
    TTL: ttl || 60,
    topic,
    urgency: urgency || 'normal',
  };
  try {
    const res = await webpush.sendNotification(subscription, payload, options);
    console.info('Send PushNotification to user: ', userId, ' with payload: ', JSON.stringify(res));
  } catch (e) {
    const error = <WebPushError>e;
    // subscription has expired or is no longer valid
    // remove it from the database
    if (error.statusCode === StatusCodes.GONE) {
      logger.info('Push Subscription has expired or is no longer valid, removing it from the database. User: ', userId);
      await removeExpiredPushSubscriptions(userId, subscription);
    }
  }
};
const removeExpiredPushSubscriptions = async (userId: string, subscription: webpush.PushSubscription) =>
  await removePushSubscriptionForUser(dbClient, userId, subscription);

export const subscribeToWebPush = withAuth(
  async (user: UserSession, body: { subscription: string; browserFingerprint: string }) => {
    const subscription = JSON.parse(body.subscription);
    await createPushSubscriptionForUser(dbClient, user.providerId, body.browserFingerprint, subscription);
    return { status: 200 };
  },
);

export const unsubscribeFromWebPush = withAuth(async (user: UserSession, body: string) => {
  const subscription: webpush.PushSubscription = JSON.parse(body);
  await removePushSubscriptionForUser(dbClient, user.providerId, subscription);
  return { status: 200 };
});
