'use server';

import { CommentWithResponses, CommonCommentProps } from '@/common/types';
import { getCommentsByObjectId } from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapToComment } from '@/utils/requests/comments/mapping';

const logger = getLogger();

export const getCommentByObjectId = async (objectId: string) => {
  try {
    const dbComments = await getCommentsByObjectId(dbClient, objectId);
    const mapComments = dbComments.map(mapToComment);
    const comments = await Promise.all(mapComments);
    const commensWithResponses = setResponses(comments);
    return commensWithResponses;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting comments for object with id: ${objectId}`,
      err as Error,
      objectId,
    );
    logger.error(error);
    throw err;
  }
};

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
