import { PrismaClient } from '@prisma/client';

import { dbError, InnoPlatformError } from '@/utils/errors';
import { getUniqueValues } from '@/utils/helpers';
import getLogger from '@/utils/logger';

import { getPostCommentsStartingFrom } from './post_comment';

const logger = getLogger();

export async function getPostById(client: PrismaClient, id: string) {
  return await client.post.findFirst({ where: { id: id } });
}

export async function getPostsStartingFrom(client: PrismaClient, from: Date) {
  try {
    const [posts, postsComments] = await Promise.all([
      getPostsFromDbStartingFrom(client, from),
      getPostCommentsStartingFrom(client, from),
    ]);

    // Get unique ids of posts
    const postIds = getUniqueValues(
      postsComments.map((comment) => comment.postComment?.postId).filter((id): id is string => id !== undefined),
    );
    const postsWithComments = await getPostsByIds(client, postIds);
    const allPosts = [...posts, ...postsWithComments];
    const uniquePosts = allPosts.filter((post, index, self) => index === self.findIndex((t) => t.id === post.id));
    return uniquePosts;
  } catch (err) {
    const error: InnoPlatformError = dbError(`Getting post comments starting from ${Date}`, err as Error);
    logger.error(error);
    throw err;
  }
}

export async function getPostsByIds(client: PrismaClient, ids: string[]) {
  return await client.post.findMany({ where: { id: { in: ids } } });
}

export async function getPostsFromDbStartingFrom(client: PrismaClient, from: Date) {
  return await client.post.findMany({
    where: {
      OR: [
        {
          createdAt: {
            gte: from,
          },
        },
        { updatedAt: { gte: from } },
      ],
    },
  });
}

export async function addPostToDb(client: PrismaClient, content: string, author: string, anonymous: boolean) {
  try {
    return await client.post.create({ data: { author, content, anonymous } });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Add post with by author: ${author}`, err as Error);
    logger.error(error);
    throw error;
  }
}

export async function deletePostFromDb(client: PrismaClient, postId: string) {
  try {
    return await client.post.delete({ where: { id: postId } });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Delete post with id: ${postId}`, err as Error);
    logger.error(error);
    throw error;
  }
}

export async function updatePostInDb(client: PrismaClient, postId: string, content: string) {
  try {
    return await client.post.update({ data: { content }, where: { id: postId } });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Update post with id: ${postId}`, err as Error);
    logger.error(error);
    throw error;
  }
}

export async function handlePostUpvoteInDb(client: PrismaClient, postId: string, upvotedBy: string) {
  try {
    return client.$transaction(async (tx) => {
      const result = await tx.post.findFirst({
        where: { id: postId },
        select: {
          upvotedBy: true,
        },
      });
      const upvotes = result?.upvotedBy.filter((upvote) => upvote !== upvotedBy);

      if (result?.upvotedBy.includes(upvotedBy)) {
        return tx.post.update({
          where: {
            id: postId,
          },
          data: {
            upvotedBy: upvotes,
          },
        });
      }

      if (result) {
        return tx.post.update({
          where: {
            id: postId,
          },
          data: {
            upvotedBy: { push: upvotedBy },
          },
        });
      }
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(`Upvote post with id: ${postId} by user ${upvotedBy}`, err as Error);
    logger.error(error);
    throw error;
  }
}
