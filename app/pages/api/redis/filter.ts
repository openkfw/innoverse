import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';

import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { getNewsFeedEntries } from '@/utils/newsFeed/redis/redisService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  const now = dayjs(new Date());
  const yesterday = now.subtract(1, 'day');
  const twoDaysAgo = now.subtract(2, 'day');

  const client = await getRedisClient();
  const resultAll = await getNewsFeedEntries(client);
  const resultSortAsc = await getNewsFeedEntries(client, { sortBy: { updatedAt: 'ASC' } });
  const resultSortDesc = await getNewsFeedEntries(client, { sortBy: { updatedAt: 'DESC' } });
  const resultFilter1 = await getNewsFeedEntries(client, { filterBy: { projectIds: ['1', '3', '4'] } });
  const resultFilter2 = await getNewsFeedEntries(client, { filterBy: { projectIds: ['1', '4'] } });
  const resultFilter3 = await getNewsFeedEntries(client, {
    filterBy: { updatedAt: { from: yesterday.toDate(), to: now.toDate() } },
  });
  const resultFilter4 = await getNewsFeedEntries(client, {
    filterBy: { updatedAt: { from: twoDaysAgo.toDate(), to: yesterday.toDate() } },
  });
  const resultFilter5 = await getNewsFeedEntries(client, {
    filterBy: { updatedAt: { from: yesterday.toDate(), to: now.toDate() }, projectIds: ['1'] },
  });
  const resultFilter6 = await getNewsFeedEntries(client, {
    filterBy: { updatedAt: { from: yesterday.toDate(), to: now.toDate() }, projectIds: ['4'] },
    sortBy: { updatedAt: 'ASC' },
  });
  const resultFilterAndSortAsc = await getNewsFeedEntries(client, {
    filterBy: { projectIds: ['2'] },
    sortBy: { updatedAt: 'ASC' },
  });
  const resultFilterAndSortDesc = await getNewsFeedEntries(client, {
    filterBy: { projectIds: ['2'] },
    sortBy: { updatedAt: 'DESC' },
  });

  const result = {
    all: resultAll,
    sortAsc: resultSortAsc,
    sortDesc: resultSortDesc,
    filter1: resultFilter1,
    filter2: resultFilter2,
    filter3: resultFilter3,
    filter4: resultFilter4,
    filter5: resultFilter5,
    filter6: resultFilter6,
    filterAndSortAsc: resultFilterAndSortAsc,
    filterAndSortDesc: resultFilterAndSortDesc,
  };
  return res.json({ status: 200, result });
}
