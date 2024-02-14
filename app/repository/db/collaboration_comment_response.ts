import { PrismaClient } from '@prisma/client';

import { Comment } from '@/common/types';

export async function getCollaborationCommentResponsesByCommentId(client: PrismaClient, commentId: string) {
  return client.collaborationCommentResponse.findMany({
    where: {
      commentId: commentId,
    },
  });
}

export async function getCollaborationCommentResponseCount(client: PrismaClient, commentId: string) {
  return client.collaborationCommentResponse.count({
    where: {
      commentId: commentId,
    },
  });
}

export async function addCollaborationCommentResponse(
  client: PrismaClient,
  author: string,
  response: string,
  commentId: string,
) {
  return client.collaborationCommentResponse.create({
    data: {
      author: author,
      response: response,
      commentId: commentId,
    },
  });
}

export async function getCollaborationCommentResponseUpvotedBy(
  client: PrismaClient,
  commentId: string,
  upvotedBy: string,
) {
  return client.collaborationCommentResponse.findMany({
    where: {
      id: commentId,
      upvotedBy: { has: upvotedBy },
    },
  });
}

export async function handleCollaborationCommentResponseUpvotedBy(
  client: PrismaClient,
  commentId: string,
  upvotedBy: string,
) {
  return client.$transaction(async (tx) => {
    const result = await tx.collaborationCommentResponse.findFirst({
      where: { id: commentId },
      select: {
        upvotedBy: true,
      },
    });
    const upvotes = result?.upvotedBy.filter((upvote) => upvote !== upvotedBy);

    if (result?.upvotedBy.includes(upvotedBy)) {
      return tx.collaborationCommentResponse.update({
        where: {
          id: commentId,
        },
        data: {
          upvotedBy: upvotes,
        },
      });
    }

    if (result) {
      return tx.collaborationCommentResponse.update({
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
