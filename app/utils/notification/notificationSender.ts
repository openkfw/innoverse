import { PushSubscription as WebPushSubscription } from 'web-push';

import { PushNotification } from '@/types/notification';
import getLogger from '@/utils/logger';
import { sendPushNotification } from '@/utils/notification/pushNotification';

const logger = getLogger();

type NotificationTopic = 'project' | 'opportunity' | 'collaboration-question' | 'survey-question' | 'event' | 'update';

export type NotificationRequest = {
  subscriptions: WebPushSubscription[];
  userId: string;
  notification: {
    topic: NotificationTopic;
    body: string;
    url: string;
  };
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
        title: 'Innohub',
        userId: request.userId,
        ...request.notification,
      };
      // Fire and forget
      sendPushNotification(subscription, pushNotification);
    }
  }
};
