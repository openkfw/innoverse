'use server';
import { StatusCodes } from 'http-status-codes';

import { CollaborationComment, UserSession } from '@/common/types';
import { getCommentById, updateCommentInDb } from '@/repository/db/comment';
import {
  addCollaborationCommentResponse,
  deleteCollaborationCommentResponse,
} from '@/services/collaborationCommentResponseService';
import {
  addCollaborationComment,
  deleteCollaborationComment,
  updateCollaborationComment,
} from '@/services/collaborationCommentService';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import {
  addCollaborationCommentResponseSchema,
  addCollaborationCommentSchema,
  deleteCollaborationCommentResponseSchema,
  deleteCollaborationCommentSchema,
  updateCollaborationCommentResponseSchema,
  updateCollaborationCommentSchema,
} from './validationSchema';

const logger = getLogger();

export const addProjectCollaborationComment = withAuth(
  async (user: UserSession, body: { projectId: string; questionId: string; comment: string }) => {
    try {
      const validatedParams = validateParams(addCollaborationCommentSchema, body);
      if (validatedParams.status === StatusCodes.OK) {
        const author = await getInnoUserByProviderId(user.providerId);
        const newComment = await addCollaborationComment({
          comment: {
            text: body.comment,
            projectId: body.projectId,
            questionId: body.questionId,
          },
          user,
        });
        return {
          status: StatusCodes.OK,
          data: {
            ...newComment,
            author,
            likedBy: [],
            commentCount: 0,
          },
        };
      }
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Adding a comment to a Project ${body.projectId} for question ${body.questionId} from user ${user.providerId}`,
        err as Error,
        body.projectId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Commenting on the project failed',
      };
    }
  },
);

export const deleteProjectCollaborationComment = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const validatedParams = validateParams(deleteCollaborationCommentSchema, body);

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
        message: 'No collaboration comment with the specified ID exists',
      };
    }

    if (comment.author !== user.providerId) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'A collaboration comment can only be deleted by its author',
      };
    }

    await deleteCollaborationComment(body.commentId);

    return {
      status: StatusCodes.OK,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Deleting Collaboration Comment with id: ${body.commentId} by user ${user.providerId}`,
      err as Error,
      body.commentId,
    );
    logger.error(error);
    throw err;
  }
});

export const updateProjectCollaborationComment = withAuth(
  async (user: UserSession, body: { commentId: string; updatedText: string }) => {
    try {
      const validatedParams = validateParams(updateCollaborationCommentSchema, body);

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
          message: 'No collaboration comment with the specified ID exists',
        };
      }

      if (comment.author !== user.providerId) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: 'A collaboration comment can only be edited by its author',
        };
      }

      const updatedComment = await updateCollaborationComment({
        user,
        comment: {
          id: body.commentId,
          text: body.updatedText,
        },
      });

      return {
        status: StatusCodes.OK,
        comment: updatedComment,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Updating Collaboration Comment with id: ${body.commentId} by user ${user.providerId}`,
        err as Error,
        body.commentId,
      );
      logger.error(error);
      throw err;
    }
  },
);

export const addProjectCollaborationCommentResponse = withAuth(
  async (user: UserSession, body: { comment: CollaborationComment; text: string }) => {
    const validatedParams = validateParams(addCollaborationCommentResponseSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
      };
    }

    const author = await getInnoUserByProviderId(user.providerId);
    const response = await addCollaborationCommentResponse({ user, text: body.text, comment: body.comment });

    const createdResponse = {
      ...response,
      text: body.text,
      likedBy: response.likes.map((like) => like.likedBy),
      author,
    };

    return {
      status: StatusCodes.OK,
      data: createdResponse,
    };
  },
);

export const deleteProjectCollaborationCommentResponse = withAuth(
  async (user: UserSession, body: { responseId: string }) => {
    try {
      const validatedParams = validateParams(deleteCollaborationCommentResponseSchema, body);

      if (validatedParams.status !== StatusCodes.OK) {
        return {
          status: validatedParams.status,
          errors: validatedParams.errors,
          message: validatedParams.message,
        };
      }

      const response = await getCommentById(dbClient, body.responseId);

      if (response === null) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: 'No collaboration comment response with the specified ID exists',
        };
      }

      if (response.author !== user.providerId) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: 'A collaboration comment response can only be deleted by its author',
        };
      }

      await deleteCollaborationCommentResponse({ user, response: { id: body.responseId } });

      return {
        status: StatusCodes.OK,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Deleting a Collaboration Comment Response with id: ${body.responseId} by user ${user.providerId}`,
        err as Error,
        body.responseId,
      );
      logger.error(error);
      throw err;
    }
  },
);

export const updateProjectCollaborationCommentResponse = withAuth(
  async (user: UserSession, body: { responseId: string; updatedText: string }) => {
    try {
      const validatedParams = validateParams(updateCollaborationCommentResponseSchema, body);

      if (validatedParams.status !== StatusCodes.OK) {
        return {
          status: validatedParams.status,
          errors: validatedParams.errors,
          message: validatedParams.message,
        };
      }

      const response = await getCommentById(dbClient, body.responseId);

      if (response === null) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: 'No collaboration comment response with the specified ID exists',
        };
      }

      if (response.author !== user.providerId) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: 'A collaboration comment response can only be edited by its author',
        };
      }

      const updatedResponse = await updateCommentInDb(dbClient, body.responseId, body.updatedText);

      return {
        status: StatusCodes.OK,
        comment: updatedResponse,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Updating a Collaboration Comment Response with id: ${body.responseId} by user ${user.providerId}`,
        err as Error,
        body.responseId,
      );
      logger.error(error);
      throw err;
    }
  },
);
