import type { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';

import { sync as synchronizeNewsFeed } from '@/utils/newsFeed/newsFeedSync';

/*
const demoUpdateItem = {
  type: 'Update',
  updatedAt: '2024-01-01T10:00:00.000Z',
  item: {
    id: '1',
    author: {
      id: '123',
      name: 'Sam',
      role: 'Dev',
      department: 'Innobuddy',
      image: 'https://...',
      email: 'sam@example.com',
      badge: false,
      providerId: '123',
    },
    comment: 'This is an update',
    topic: '',
    projectId: '12345',
    projectStart: '2024-01-01',
    linkToCollaborationTab: false,
    updatedAt: '2024-01-01T10:00:00.000Z',
    reactions: [
      {
        id: '1',
        reactedBy: '1234',
        shortCode: ':no_mouth:',
        nativeSymbol: '😶',
        createdAt: '2024-05-22T18:01:23.414Z',
      },
    ],
    comments: [
      {
        id: '123455',
        createdAt: '2024-05-22T18:01:23.414Z',
        comment: 'This is a comment',
        upvotedBy: ['456'],
        responses: [
          {
            id: '123456',
            createdAt: '2024-05-22T18:01:23.414Z',
            comment: 'This is a comment',
            upvotedBy: ['456'],
          },
        ],
      },
    ],
  },
};
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const sync = await synchronizeNewsFeed();
  return res.json({ status: StatusCodes.OK, result: sync });
}
