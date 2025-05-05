import { getServerSession } from 'next-auth';
import { StatusCodes } from 'http-status-codes';

import { countNewsFeedEntriesByProjectIds, countNewsFeedEntriesByType } from '@/utils/newsFeed/redis/redisService';
import { hasCachePermissions } from '@/utils/requests/userPermissions/requests';

import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session == undefined) {
      return Response.json({ error: 'User is not authenticated' }, { status: StatusCodes.UNAUTHORIZED });
    }
    const userHasCachePermissions = await hasCachePermissions(session.user.providerId);
    if (!userHasCachePermissions) {
      return Response.json({ error: 'User is not allowed' }, { status: StatusCodes.UNAUTHORIZED });
    } else {
      const result1 = await countNewsFeedEntriesByType();
      const result2 = await countNewsFeedEntriesByProjectIds();
      return Response.json(
        { status: 200, result: { type: result1, projectIds: result2 } },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        },
      );
    }
  } catch (err) {
    return Response.json({ error: 'Request failed' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}
