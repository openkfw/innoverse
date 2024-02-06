'use server';

import webpush, { PushSubscription as WebPushSubscription, WebPushError } from 'web-push';
import { PushNotification } from '@/types/notification';

import { createPushSubscriptionForUser, removePushSubscriptionForUser } from '@/repository/db/push_subscriptions';
import dbClient from '../../repository/db/prisma/prisma';
import { withAuth } from '@/utils/auth';
import { UserSession } from '@/common/types';

webpush.setVapidDetails(
  process.env.VAPID_ADMIN_EMAIL || 'admin@localhost',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || '',
);

export const sendPushNotification = async (
  subscriptions: WebPushSubscription[],
  pushNotification: PushNotification,
) => {
  const { type, userId, topic, title, body, urgency, icon, ttl } = pushNotification;
  if (type !== 'push') {
    console.error('Can not send push notification, type is not push notification!');
  }
  const payload = JSON.stringify({
    title,
    body,
    icon,
  });
  const options = {
    TTL: ttl || 60,
    topic,
    urgency: urgency || 'normal',
  };
  for (const subscription of subscriptions) {
    try {
      const res = await webpush.sendNotification(subscription, payload, options);
      console.info('Send PushNotification to user: ', userId, ' with payload: ', JSON.stringify(res));
    } catch (e) {
      const error = <WebPushError>e;
      // subscription has expired or is no longer valid
      // remove it from the database
      if (error.statusCode === 410) {
        console.info(
          'Push Subscription has expired or is no longer valid, removing it from the database. User: ',
          userId,
        );
        await removeExpiredPushSubscriptions(userId, subscription);
      }
    }
  }
};
const removeExpiredPushSubscriptions = async (userId: string, subscription: webpush.PushSubscription) =>
  removePushSubscriptionForUser(dbClient, userId, subscription);

export const subscribeToWebPush = withAuth(async (user: UserSession, body: string) => {
  const subscription = JSON.parse(body);
  await createPushSubscriptionForUser(dbClient, user.providerId, subscription);
  return { status: 200 };
});

export const unsubscribeFromWebPush = withAuth(async (user: UserSession, body: string) => {
  const subscription: webpush.PushSubscription = JSON.parse(body);
  await removePushSubscriptionForUser(dbClient, user.providerId, subscription);
  return { status: 200 };
});
