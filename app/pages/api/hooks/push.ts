import type { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { literal, number, object, string, z } from 'zod';

import { PushNotification } from '@/types/notification';
import { evalPushNotificationRules } from '@/utils/notification/notificationResolver';
import { sendPushNotification } from '@/utils/notification/pushNotification';

// Header parsing. These headers are required for the push notification to work. Additional headers are allowed but ignored.
const headerSchema = z.object({
  authorization: string(),
});

const bodySchema = z.object({
  event: literal('entry.create')
    .or(literal('entry.update'))
    .or(literal('entry.delete'))
    .or(literal('entry.publish'))
    .or(literal('entry.unpublish')),
  model: string(),
  entry: object({ id: string().or(number()) }),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, headers } = req;
  const { authorization } = headerSchema.parse(headers);
  const { event, model, entry } = bodySchema.parse(body);

  if (method !== 'POST') return res.status(StatusCodes.METHOD_NOT_ALLOWED);
  if (authorization !== process.env.STRAPI_PUSH_NOTIFICATION_SECRET) return res.status(StatusCodes.UNAUTHORIZED);

  const evaluationResult = await evalPushNotificationRules(event, model, entry);

  if (evaluationResult.shouldNotify()) {
    const notifications = await evaluationResult.buildPushNotifications();
    for (const notification of notifications) {
      for (const subscription of notification.subscriptions) {
        //notify all devices of the user
        const pushNotification: PushNotification = {
          urgency: 'normal',
          icon: '/favicon.ico',
          ttl: 60,
          type: 'push',
          title: 'Innohub',
          userId: notification.userId,
          ...notification.notification,
        };
        // Fire and forget
        sendPushNotification(subscription, pushNotification);
      }
    }
  }

  return res.status(StatusCodes.OK);
}
