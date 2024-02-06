import type { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { PushSubscription as WebPushSubscription } from 'web-push';
import { literal, number, object, string, z } from 'zod';

import { getProjectFollowers } from '@/repository/db/follow';
import { getPushSubscriptionsForUser } from '@/repository/db/push_subscriptions';
import { PushNotification } from '@/types/notification';
import { sendPushNotification } from '@/utils/notification/pushNotification';

import dbClient from './../../../repository/db/prisma/prisma';

// Header parsing. Theese headers are required for the push notification to work. Additional headers are allowed but ignored.
const headerSchema = z.object({
  authorization: string(),
});

const bodySchema = z.object({
  event: literal('entry.create').or(literal('entry.update')).or(literal('entry.delete')).or(literal('entry.publish')),
  model: string(),
  entry: object({ id: string().or(number()) }),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, headers } = req;
  const { authorization } = headerSchema.parse(headers);
  const { event, model, entry } = bodySchema.parse(body);

  if (method !== 'POST') return res.status(StatusCodes.METHOD_NOT_ALLOWED);
  if (authorization !== process.env.STRAPI_PUSH_NOTIFICATION_SECRET) return res.status(StatusCodes.UNAUTHORIZED);

  //TODO: Rules should be defined in an external file
  if ((event === 'entry.publish' || event === 'entry.update') && model === 'project') {
    // notify subscribed users about the new project, if the project is published for the first time (= not an update),
    // we will not find any followers in the database.
    const followers = await getProjectFollowers(dbClient, entry.id.toString());
    for (const user of followers) {
      const pushSubscriptions: WebPushSubscription[] = await getPushSubscriptionsForUser(dbClient, user.followedBy);
      //notify all devices of the user
      const notification: PushNotification = {
        userId: user.id,
        type: 'push',
        topic: 'project',
        title: 'Innobuddy',
        body: 'A project you follow has been updated recently.',
        urgency: 'normal',
        icon: '/favicon.ico',
        ttl: 60,
      };
      // Fire and forget
      sendPushNotification(pushSubscriptions, notification);
    }
  }

  return res.status(StatusCodes.OK);
}
