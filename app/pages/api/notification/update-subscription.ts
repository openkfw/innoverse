import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { StatusCodes } from 'http-status-codes';
import { string, z } from 'zod';

import { options } from '@/pages/api/auth/[...nextauth]';
import { updatePushSubscriptionForUser } from '@/repository/db/push_subscriptions';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

import dbClient from './../../../repository/db/prisma/prisma';

const logger = getLogger();

const bodySchema = z.object({
  oldSubscription: string(),
  newSubscription: string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, body } = req;
    const session = await getServerSession(options);
    if (method !== 'POST') return res.status(StatusCodes.METHOD_NOT_ALLOWED);
    if (session == undefined) {
      return {
        status: StatusCodes.UNAUTHORIZED,
        errors: new Error('User is not authenticated'),
      };
    }

    const { oldSubscription, newSubscription } = bodySchema.parse(body);
    await updatePushSubscriptionForUser(
      dbClient,
      session.user.providerId,
      JSON.parse(oldSubscription),
      JSON.parse(newSubscription),
    );
    return res.status(StatusCodes.OK);
  } catch (err) {
    const session = await getServerSession(options);
    const error: InnoPlatformError = dbError(
      `Update push subscription for user ${session?.user.providerId}`,
      err as Error,
    );
    logger.error(error);
    throw err;
  }
}
