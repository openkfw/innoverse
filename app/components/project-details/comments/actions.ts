'use server';

import { StatusCodes } from 'http-status-codes';

import { Comment, UserSession } from '@/common/types';
import {
  addCommentToDb,
  deleteCommentInDb,
  getCommentById,
  handleCommentLike,
  updateCommentInDb,
} from '@/repository/db/comment';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import {
  commentLikedBySchema,
  deleteCommentSchema,
  handleCommentSchema,
  updateCommentSchema,
} from './validationSchema';

const logger = getLogger();

export const addProjectComment = withAuth(async (user: UserSession, body: { projectId: string; comment: string }) => {
  try {
    const validatedParams = validateParams(handleCommentSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const newComment = await addCommentToDb({
        client: dbClient,
        objectId: body.projectId,
        objectType: 'PROJECT',
        author: user.providerId,
        text: body.comment,
      });
      const author = await getInnoUserByProviderId(user.providerId);
      return {
        status: StatusCodes.OK,
        data: {
          ...newComment,
          author,
          likedBy: [],
          responseCount: 0,
          questionId: '',
          responses: [],
        } as Comment,
      };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Adding a Comment to a Project ${body.projectId} by user ${user.providerId}`,
      err as Error,
      body.projectId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Adding a Comment failed',
    };
  }
});

export const handleProjectCommentLikeBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const validatedParams = validateParams(commentLikedBySchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const updatedComment = await handleCommentLike(dbClient, body.commentId, user.providerId);
      return {
        status: StatusCodes.OK,
        likedBy: updatedComment?.likedBy,
      };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Adding an like of a Comment ${body.commentId} for user ${user.providerId}`,
      err as Error,
      body.commentId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Liking comment failed',
    };
  }
});

export const deleteProjectComment = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const validatedParams = validateParams(deleteCommentSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    }

    const comment = await getCommentById(dbClient, body.commentId);

    if (comment === null) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'No comment with the specified ID exists',
      };
    }

    if (comment.author !== user.providerId) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'A comment can only be deleted by its author',
      };
    }

    await deleteCommentInDb(dbClient, body.commentId);

    return {
      status: StatusCodes.OK,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Deleting a Comment ${body.commentId} from user ${user.providerId}`,
      err as Error,
      body.commentId,
    );
    logger.error(error);
    throw err;
  }
});

export const updateProjectComment = withAuth(
  async (user: UserSession, body: { commentId: string; updatedText: string }) => {
    try {
      const validatedParams = validateParams(updateCommentSchema, body);

      if (validatedParams.status !== StatusCodes.OK) {
        return {
          status: validatedParams.status,
          errors: validatedParams.errors,
          message: validatedParams.message,
        };
      }

      const comment = await getCommentById(dbClient, body.commentId);

      if (comment === null) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: 'No comment with the specified ID exists',
        };
      }

      if (comment.author !== user.providerId) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: 'A comment can only be edited by its author',
        };
      }

      const updatedComment = await updateCommentInDb(dbClient, body.commentId, body.updatedText);

      return {
        status: StatusCodes.OK,
        comment: updatedComment,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Updating a Comment ${body.commentId} by user ${user.providerId}`,
        err as Error,
        body.commentId,
      );
      logger.error(error);
      throw err;
    }
  },
);
