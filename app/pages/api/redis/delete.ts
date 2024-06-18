import type { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';

import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { deleteItemFromRedis } from '@/utils/newsFeed/redis/redisService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  if (method !== 'DELETE') return res.status(StatusCodes.METHOD_NOT_ALLOWED);

  const client = await getRedisClient();
  await deleteItemFromRedis(client, body);
  return res.json({ status: 200, result: 'OK' });
}
