import { getServerSession } from 'next-auth';
import { StatusCodes } from 'http-status-codes';
import { string, z } from 'zod';

import { updatePushSubscriptionForUser } from '@/repository/db/push_subscriptions';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

import dbClient from '../../../../repository/db/prisma/prisma';
import { authOptions } from '../../auth/[...nextauth]/options';

const logger = getLogger();

const bodySchema = z.object({
  oldSubscription: string(),
  newSubscription: string(),
});

export async function POST({ body }: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session == undefined) {
      return Response.json({ errors: new Error('User is not authenticated') }, { status: StatusCodes.UNAUTHORIZED });
    }

    const { oldSubscription, newSubscription } = bodySchema.parse(body);
    await updatePushSubscriptionForUser(
      dbClient,
      session.user.providerId,
      JSON.parse(oldSubscription),
      JSON.parse(newSubscription),
    );
    return new Response('OK');
  } catch (err) {
    const session = await getServerSession(authOptions);
    const error: InnoPlatformError = dbError(
      `Update push subscription for user ${session?.user.providerId}`,
      err as Error,
    );
    logger.error(error);
    throw err;
  }
}
