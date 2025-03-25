import { PrismaClient } from '@prisma/client';

import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

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
