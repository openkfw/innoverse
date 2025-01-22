'use server';

import { CommentWithResponses, CommonCommentProps, UserSession } from '@/common/types';
import { getCommentsByObjectId } from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapToComment } from '@/utils/requests/comments/mapping';
import { StatusCodes } from 'http-status-codes';

const logger = getLogger();

export const getCommentByObjectId = withAuth(async (user: UserSession, body: { objectId: string }) => {
  try {
    const dbComments = await getCommentsByObjectId(dbClient, body.objectId);
    const comments = await Promise.all(dbComments.map((comment) => mapToComment(comment, user.providerId)));
    const commensWithResponses = setResponses(comments);
    return {
      status: StatusCodes.OK,
      data: commensWithResponses,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting comments for object with id: ${body.objectId}`,
      err as Error,
      body.objectId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting comments for object failed',
    };
  }
});

const setResponses = (comments: CommonCommentProps[]) => {
  const rootComments: CommentWithResponses[] = comments
    .filter((comment) => !comment.parentId)
    .map((comment) => ({ ...comment, responses: [] }));

  let queue = rootComments;

  while (queue.length) {
    queue.forEach((comment) => {
      comment.responses = getResponsesForComment(comments, comment);
    });
    queue = queue.flatMap((comment) => comment.responses);
  }

  return rootComments;
};

const getResponsesForComment = (
  comments: CommonCommentProps[],
  rootComment: CommentWithResponses,
): CommentWithResponses[] => {
  return comments
    .filter((comment) => comment.parentId === rootComment.id)
    .map((response) => ({ ...response, responses: [] }));
};
