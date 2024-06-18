import type { NextApiRequest, NextApiResponse } from 'next';

import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { getNewsFeedEntries } from '@/utils/newsFeed/redis/redisService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const client = await getRedisClient();
  const result = await getNewsFeedEntries(client, { sortBy: { updatedAt: 'DESC' } });
  return res.json({ status: 200, result });
}
