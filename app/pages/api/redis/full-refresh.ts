import type { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';

import { sync as synchronizeNewsFeed } from '@/utils/newsFeed/newsFeedSync';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const sync = await synchronizeNewsFeed();
  return res.json({ status: StatusCodes.OK, result: sync });
}
