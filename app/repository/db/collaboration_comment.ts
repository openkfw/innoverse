import { PrismaClient } from '@prisma/client';

export async function getCollaborationCommentById(client: PrismaClient, commentId: string) {
  return client.collaborationComment.findFirst({
    where: {
      id: commentId,
    },
  });
}

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

export async function updateCollaborationComment(client: PrismaClient, commentId: string, updatedText: string) {
  return client.collaborationComment.update({
    where: {
      id: commentId,
    },
    data: {
      comment: updatedText,
    },
  });
}

export async function deleteCollaborationComment(client: PrismaClient, commentId: string) {
  return client.collaborationComment.delete({
    where: {
      id: commentId,
    },
  });
}

export async function getCollaborationCommentIsUpvotedBy(client: PrismaClient, commentId: string, upvotedBy: string) {
  const upvotedCommentCount = await client.collaborationComment.count({
    where: {
      id: commentId,
      upvotedBy: { has: upvotedBy },
    },
  });

  return upvotedCommentCount > 0;
}

export async function handleCollaborationCommentUpvote(client: PrismaClient, commentId: string, upvotedBy: string) {
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
