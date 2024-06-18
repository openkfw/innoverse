import { PrismaClient } from '@prisma/client';

export async function getCollaborationCommentResponseById(client: PrismaClient, responseId: string) {
  return client.collaborationCommentResponse.findFirst({
    where: {
      id: responseId,
    },
  });
}

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

export async function addCollaborationCommentResponseToDb(
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

export async function updateCollaborationCommentResponseInDb(
  client: PrismaClient,
  responseId: string,
  updatedText: string,
) {
  return client.collaborationCommentResponse.update({
    where: {
      id: responseId,
    },
    data: {
      response: updatedText,
    },
  });
}

export async function deleteCollaborationCommentResponseInDb(client: PrismaClient, responseId: string) {
  return client.collaborationCommentResponse.delete({
    where: {
      id: responseId,
    },
  });
}

export async function getCollaborationCommentResponseUpvotedBy(
  client: PrismaClient,
  responseId: string,
  upvotedBy: string,
) {
  return client.collaborationCommentResponse.findMany({
    where: {
      id: responseId,
      upvotedBy: { has: upvotedBy },
    },
  });
}

export async function handleCollaborationCommentResponseUpvotedByInDb(
  client: PrismaClient,
  responseId: string,
  upvotedBy: string,
) {
  return client.$transaction(async (tx) => {
    const result = await tx.collaborationCommentResponse.findFirst({
      where: { id: responseId },
      select: {
        upvotedBy: true,
      },
    });
    const upvotes = result?.upvotedBy.filter((upvote) => upvote !== upvotedBy);

    if (result?.upvotedBy.includes(upvotedBy)) {
      return tx.collaborationCommentResponse.update({
        where: {
          id: responseId,
        },
        data: {
          upvotedBy: upvotes,
        },
      });
    }

    if (result) {
      return tx.collaborationCommentResponse.update({
        where: {
          id: responseId,
        },
        data: {
          upvotedBy: { push: upvotedBy },
        },
      });
    }
  });
}
