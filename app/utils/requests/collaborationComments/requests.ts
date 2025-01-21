'use server';

import { StatusCodes } from 'http-status-codes';

import { CollaborationComment, Comment, UserSession } from '@/common/types';
import {
  collaborationCommentResponseLikedBySchema,
  getCollaborationCommentResponsesSchema,
  getCollaborationCommentsSchema,
} from '@/components/collaboration/comments/validationSchema';
import {
  getCommentResponseCount,
  getCommentsByAdditionalObjectId,
  getCommentsByParentId,
  isCommentLikedBy,
} from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import { getPromiseResults, sortDateByCreatedAtAsc } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import { validateParams } from '@/utils/validationHelper';

import { mapToComment } from '../comments/mapping';

const logger = getLogger();

export const getProjectCollaborationComments = async (body: { projectId: string; questionId: string }) => {
  try {
    const validatedParams = validateParams(getCollaborationCommentsSchema, body);

    if (validatedParams.status === StatusCodes.OK) {
      const questionComments = await getCommentsByAdditionalObjectId(dbClient, body.projectId, body.questionId, true);
      const sortedComments = sortDateByCreatedAtAsc(questionComments);

      const getComments = sortedComments.map(async (comment) => {
        const getLikes = comment.likes.map(async (like) => await getInnoUserByProviderId(like.likedBy));
        const likes = await getPromiseResults(getLikes);
        const responseCount = await getCommentResponseCount(dbClient, comment.id);

        return {
          ...comment,
          likedBy: likes,
          responseCount: responseCount,
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

export const getProjectCollaborationCommentResponses = async (body: { comment: CollaborationComment }) => {
  const validatedParams = validateParams(getCollaborationCommentResponsesSchema, body);

  if (validatedParams.status !== StatusCodes.OK) {
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  }

  const responses = await getCommentsByParentId(dbClient, body.comment.id);

  const responsePromises = responses.map(async (response) => mapToComment(response));

  const commentResponses = (await getPromiseResults(responsePromises)) as Comment[];

  return {
    status: StatusCodes.OK,
    data: sortDateByCreatedAtAsc(commentResponses),
  };
};

export const isProjectCollaborationCommentResponseLikedBy = withAuth(
  async (user: UserSession, body: { responseId: string }) => {
    try {
      const validatedParams = validateParams(collaborationCommentResponseLikedBySchema, body);
      if (validatedParams.status === StatusCodes.OK) {
        const result = await isCommentLikedBy(dbClient, body.responseId, user.providerId);
        return {
          status: StatusCodes.OK,
          data: result,
        };
      }
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Checking if user ${user.providerId} has liked response ${body.responseId}`,
        err as Error,
        user.providerId,
      );
      logger.error(error);
      throw err;
    }
  },
);
