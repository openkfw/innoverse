import { PrismaClient } from '@prisma/client';

import { ObjectType } from '@/common/types';
import { dbError, InnoPlatformError } from '@/utils/errors';
import { getUniqueValues } from '@/utils/helpers';
import getLogger from '@/utils/logger';

import { getCommentsStartingFrom } from './comment';

const logger = getLogger();

export async function deletePostFromDb(client: PrismaClient, postId: string) {
  try {
    return await client.post.delete({ where: { id: postId } });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Delete post with id: ${postId}`, err as Error);
    logger.error(error);
    throw error;
  }
}

export async function getAllPostsFromDb(client: PrismaClient) {
  try {
    return await client.post.findMany();
  } catch (err) {
    const error: InnoPlatformError = dbError(`Getting all posts`, err as Error);
    logger.error(error);
    throw err;
  }
}
