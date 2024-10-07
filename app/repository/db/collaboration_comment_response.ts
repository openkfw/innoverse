import { PrismaClient } from '@prisma/client';

import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

const logger = getLogger();

export async function getCollaborationCommentResponseById(client: PrismaClient, responseId: string) {
  try {
    return client.collaborationCommentResponse.findFirst({
      where: {
        id: responseId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Get collaboration comment response with id: ${responseId}`,
      err as Error,
      responseId,
    );
    logger.error(error);
    throw err;
  }
}

export async function getCollaborationCommentResponsesByCommentId(client: PrismaClient, commentId: string) {
  try {
    return client.collaborationCommentResponse.findMany({
      where: {
        commentId: commentId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Get collaboration comment responses for comment with id: ${commentId}`,
      err as Error,
      commentId,
    );
    logger.error(error);
    throw err;
  }
}

export async function getCollaborationCommentResponseCount(client: PrismaClient, commentId: string) {
  try {
    return client.collaborationCommentResponse.count({
      where: {
        commentId: commentId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Get collaboration comment response count for comment with id: ${commentId}`,
      err as Error,
      commentId,
    );
    logger.error(error);
    throw err;
  }
}

export async function addCollaborationCommentResponseToDb(
  client: PrismaClient,
  author: string,
  response: string,
  commentId: string,
) {
  try {
    return client.collaborationCommentResponse.create({
      data: {
        author: author,
        response: response,
        commentId: commentId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Add collaboration comment to comment with id: ${commentId} by user: ${author}`,
      err as Error,
      commentId,
    );
    logger.error(error);
    throw err;
  }
}

export async function updateCollaborationCommentResponseInDb(
  client: PrismaClient,
  responseId: string,
  updatedText: string,
) {
  try {
    return client.collaborationCommentResponse.update({
      where: {
        id: responseId,
      },
      data: {
        response: updatedText,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Update collaboration comment response with id: ${responseId}`,
      err as Error,
      responseId,
    );
    logger.error(error);
    throw err;
  }
}

export async function deleteCollaborationCommentResponseInDb(client: PrismaClient, responseId: string) {
  try {
    return client.collaborationCommentResponse.delete({
      where: {
        id: responseId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Delete collaboration comment response with id: ${responseId}`,
      err as Error,
      responseId,
    );
    logger.error(error);
    throw err;
  }
}

export async function getCollaborationCommentResponseUpvotedBy(
  client: PrismaClient,
  responseId: string,
  upvotedBy: string,
) {
  try {
    return client.collaborationCommentResponse.findMany({
      where: {
        id: responseId,
        upvotedBy: { has: upvotedBy },
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Get collaboration comment upvotes for response with id: ${responseId}`,
      err as Error,
      responseId,
    );
    logger.error(error);
    throw err;
  }
}

export async function handleCollaborationCommentResponseUpvotedByInDb(
  client: PrismaClient,
  responseId: string,
  upvotedBy: string,
) {
  try {
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
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Handle collaboration comment upvotes for response with id: ${responseId}`,
      err as Error,
      responseId,
    );
    logger.error(error);
    throw err;
  }
}
