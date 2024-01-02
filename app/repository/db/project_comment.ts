import { PrismaClient } from '@prisma/client';

export async function getProjectComments(client: PrismaClient, projectId: string) {
  return client.projectComment.findMany({
    where: {
      projectId,
    },
  });
}

export async function addComment(client: PrismaClient, projectId: string, author: string, comment: string) {
  return client.projectComment.create({
    data: {
      projectId,
      author,
      comment,
    },
  });
}

export async function getCommentUpvotedBy(client: PrismaClient, commentId: string, upvotedBy: string) {
  return client.projectComment.findMany({
    where: {
      id: commentId,
      upvotedBy: { has: upvotedBy },
    },
  });
}

export async function handleCommentUpvotedBy(client: PrismaClient, commentId: string, upvotedBy: string) {
  return client.$transaction(async (tx) => {
    const result = await tx.projectComment.findFirst({
      where: { id: commentId },
      select: {
        upvotedBy: true,
      },
    });

    const upvotes = result?.upvotedBy.filter((upvote) => upvote !== upvotedBy);
    if (result?.upvotedBy.includes(upvotedBy)) {
      return tx.projectComment.update({
        where: {
          id: commentId,
        },
        data: {
          upvotedBy: upvotes,
        },
      });
    }

    if (result) {
      return tx.projectComment.update({
        where: {
          id: commentId,
        },
        data: {
          upvotedBy: { push: upvotedBy },
        },
      });
    }
  });
}
