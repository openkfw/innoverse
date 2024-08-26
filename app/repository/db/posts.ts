import { PrismaClient } from '@prisma/client';
import { getPostCommentsStartingFrom } from './post_comment';
import { getUniqueValues } from '@/utils/helpers';

export async function getPostById(client: PrismaClient, id: string) {
  return await client.post.findFirst({ where: { id: id } });
}

export async function getPostsStartingFrom(client: PrismaClient, from: Date) {
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
  return await client.post.create({ data: { author, content, anonymous } });
}

export async function deletePostFromDb(client: PrismaClient, postId: string) {
  return await client.post.delete({ where: { id: postId } });
}

export async function updatePostInDb(client: PrismaClient, postId: string, content: string) {
  return await client.post.update({ data: { content }, where: { id: postId } });
}

export async function handlePostUpvoteInDb(client: PrismaClient, postId: string, upvotedBy: string) {
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
}
