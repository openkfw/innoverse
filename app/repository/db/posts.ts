import { PrismaClient } from '@prisma/client';

export async function getPostById(client: PrismaClient, id: string) {
  return await client.post.findFirst({ where: { id: id } });
}

export async function getPostsStartingFrom(client: PrismaClient, from: Date) {
  return await client.post.findMany({ where: { createdAt: { gte: from }, OR: [{ updatedAt: { gte: from } }] } });
}

export async function addPostToDb(client: PrismaClient, content: string, author: string) {
  return await client.post.create({ data: { author, content } });
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
