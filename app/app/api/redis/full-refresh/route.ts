import { sync as synchronizeNewsFeed } from '@/utils/newsFeed/newsFeedSync';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { StatusCodes } from 'http-status-codes';
import { hasCachePermissions } from '@/utils/requests/userPermissions/requests';

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
      const sync = await synchronizeNewsFeed(0, true);
      return Response.json(sync, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
    }
  } catch (err) {
    return Response.json({ error: 'Request failed' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}
