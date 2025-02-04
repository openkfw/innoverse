import { sync as synchronizeNewsFeed } from '@/utils/newsFeed/newsFeedSync';

export async function GET() {
  const sync = await synchronizeNewsFeed();
  // return as json with no cache
  return Response.json(sync, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
