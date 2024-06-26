import type { NextApiRequest, NextApiResponse } from 'next';

import { countNewsFeedEntriesByProjectIds, countNewsFeedEntriesByType } from '@/utils/newsFeed/redis/redisService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const result1 = await countNewsFeedEntriesByType();
  const result2 = await countNewsFeedEntriesByProjectIds();
  return res.json({ status: 200, result: { type: result1, projectIds: result2 } });
}
