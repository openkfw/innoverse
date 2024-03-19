import { PrismaClient } from '@prisma/client';

export async function getCollaborationQuestionComments(client: PrismaClient, projectId: string, questionId: string) {
  return client.collaborationComment.findMany({
    where: {
      projectId,
      questionId,
    },
  });
}

export async function addCollaborationComment(
  client: PrismaClient,
  projectId: string,
  questionId: string,
  author: string,
  comment: string,
  visible: boolean = true,
) {
  return client.collaborationComment.create({
    data: {
      projectId,
      questionId,
      author,
      comment,
      visible,
    },
  });
}

export async function getCollaborationCommentUpvotedBy(client: PrismaClient, commentId: string, upvotedBy: string) {
  return client.collaborationComment.findMany({
    where: {
      id: commentId,
      upvotedBy: { has: upvotedBy },
    },
  });
}

export async function handleCollaborationCommentUpvotedBy(client: PrismaClient, commentId: string, upvotedBy: string) {
  return client.$transaction(async (tx) => {
    const result = await tx.collaborationComment.findFirst({
      where: { id: commentId },
      select: {
        upvotedBy: true,
      },
    });
    const upvotes = result?.upvotedBy.filter((upvote) => upvote !== upvotedBy);

    if (result?.upvotedBy.includes(upvotedBy)) {
      return tx.collaborationComment.update({
        where: {
          id: commentId,
        },
        data: {
          upvotedBy: upvotes,
        },
      });
    }

    if (result) {
      return tx.collaborationComment.update({
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
