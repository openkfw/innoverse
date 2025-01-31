import { countNewsFeedEntriesByProjectIds, countNewsFeedEntriesByType } from '@/utils/newsFeed/redis/redisService';

export async function GET() {
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
