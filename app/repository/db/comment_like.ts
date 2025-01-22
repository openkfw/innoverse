import { PrismaClient } from '@prisma/client';

export async function getCommentLikes(client: PrismaClient, commentId: string, limit?: number) {
  const query: any = {
    where: {
      commentId,
    },
  };

  if (limit) query.take = limit;

  const res = await client.commentLike.findMany(query);
  return res;
}

export async function getUserCommentLikes(client: PrismaClient, likedBy: string, limit?: number) {
  const query: any = {
    where: {
      likedBy,
    },
  };

  if (limit) query.take = limit;

  return client.commentLike.findMany(query);
}
export async function isCommentLikedBy(client: PrismaClient, commentId: string, likedBy: string) {
  const isLikedByUserCount = await client.commentLike.count({
    where: {
      commentId,
      likedBy,
    },
  });
  return isLikedByUserCount > 0;
}

export async function deleteCommentAndUserLike(client: PrismaClient, commentId: string, likedBy: string) {
  return client.commentLike.deleteMany({
    where: {
      commentId,
      likedBy,
    },
  });
}

export async function addCommentLike(client: PrismaClient, commentId: string, likedBy: string) {
  return client.commentLike.upsert({
    where: {
      likedBy_commentId: {
        commentId,
        likedBy,
      },
    },
    update: {
      commentId,
      likedBy,
    },
    create: {
      commentId,
      likedBy,
    },
  });
}
