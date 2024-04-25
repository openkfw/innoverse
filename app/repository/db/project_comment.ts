import { PrismaClient } from '@prisma/client';

export async function getComments(client: PrismaClient, projectId: string) {
  return client.projectComment.findMany({
    where: {
      projectId,
    },
  });
}

export async function getCommentbyId(client: PrismaClient, commentId: string) {
  return client.projectComment.findFirst({
    where: {
      id: commentId,
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

export async function updateComment(client: PrismaClient, commentId: string, updatedText: string) {
  return client.projectComment.update({
    where: {
      id: commentId,
    },
    data: {
      comment: updatedText,
    },
  });
}

export async function deleteComment(client: PrismaClient, commentId: string) {
  return client.projectComment.delete({
    where: {
      id: commentId,
    },
  });
}

export async function isCommentUpvotedBy(client: PrismaClient, commentId: string, upvotedBy: string) {
  const likedCommentsCount = await client.projectComment.count({
    where: {
      id: commentId,
      upvotedBy: { has: upvotedBy },
    },
  });
  return likedCommentsCount > 0;
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
