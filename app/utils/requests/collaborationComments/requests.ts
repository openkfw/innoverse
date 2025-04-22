'use server';

import { StatusCodes } from 'http-status-codes';

import { getCollaborationCommentsSchema } from '@/components/collaboration/comments/validationSchema';
import { getCommentResponseCount, getCommentsByAdditionalObjectId } from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import { getPromiseResults, sortDateByCreatedAtAsc } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import { validateParams } from '@/utils/validationHelper';

const logger = getLogger();

export const getProjectCollaborationComments = async (body: { projectId: string; questionId: string }) => {
  try {
    const validatedParams = validateParams(getCollaborationCommentsSchema, body);

    if (validatedParams.status === StatusCodes.OK) {
      const questionComments = await getCommentsByAdditionalObjectId(dbClient, body.projectId, body.questionId, true);
      const sortedComments = sortDateByCreatedAtAsc(questionComments);

      const getComments = sortedComments.map(async (comment) => {
        const getLikes = comment.likes.map(async (like) => await getInnoUserByProviderId(like.likedBy));
        const likedBy = await getPromiseResults(getLikes);
        const commentCount = await getCommentResponseCount(dbClient, comment.id);

        return {
          ...comment,
          likedBy,
          commentCount,
        };
      });

      const comments = await getPromiseResults(getComments);
      return { status: StatusCodes.OK, data: comments };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting collaboration comments for Project ${body.projectId} and question ${body.questionId}`,
      err as Error,
      body.projectId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting collaboration comments for Project failed',
    };
  }
};
