import { Follow as PrismaFollow } from '@prisma/client';
import { PushSubscription as WebPushSubscription } from 'web-push';

import dbClient from '@/repository/db/prisma/prisma';
import { getPushSubscriptionsForUser } from '@/repository/db/push_subscriptions';
import { PushNotification } from '@/types/notification';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { sendPushNotification } from '@/utils/notification/pushNotification';

const logger = getLogger();

export type NotificationTopic =
  | 'project'
  | 'opportunity'
  | 'collaboration-question'
  | 'survey-question'
  | 'event'
  | 'update'
  | 'post';

export type NotificationRequest = {
  subscriptions: WebPushSubscription[];
  userId: string;
  notification: {
    topic: NotificationTopic;
    body: string;
    url: string;
  };
};

export const notifyFollowers = async (follows: PrismaFollow[], topic: NotificationTopic, text: string, url: string) => {
  try {
    const buildNotifications = follows.map((follow) => createNotificationForFollow(follow, topic, text, url));
    const notifications = await getPromiseResults(buildNotifications);
    sendPushNotifications(notifications);
  } catch (err) {
    logger.error(
      `Failed to notify followers with ids (Topic: '${topic}', text: '${text}', url: '${url}'): ${follows.map((follow) => follow.followedBy)}`,
      follows,
      err,
    );
  }
};

export const sendPushNotifications = (notifications: NotificationRequest[]) => {
  const totalSubscriptions = notifications.reduce((sum, current) => sum + current.subscriptions.length, 0);
  logger.info(`Sending out ${notifications.length} notifications to in total ${totalSubscriptions} subscriptions ...`);

  for (const request of notifications) {
    for (const subscription of request.subscriptions) {
      // Notify all devices of the user
      const pushNotification: PushNotification = {
        urgency: 'normal',
        icon: '/favicon.ico',
        ttl: 60,
        type: 'push',
        title: 'Innoverse',
        userId: request.userId,
        ...request.notification,
      };
      // Fire and forget
      sendPushNotification(subscription, pushNotification);
    }
  }
};

const createNotificationForFollow = async (
  follow: PrismaFollow,
  topic: NotificationTopic,
  text: string,
  url: string,
): Promise<NotificationRequest> => {
  const subscriptions = await getPushSubscriptionsForUser(dbClient, follow.followedBy);

  return {
    subscriptions: subscriptions,
    userId: follow.followedBy,
    notification: {
      topic,
      body: text,
      url,
    },
  };
};
