'use server';
import { StatusCodes } from 'http-status-codes';

import { Comment, CommentResponse, User, UserSession } from '@/common/types';
import {
  addCollaborationComment,
  deleteCollaborationComment,
  getCollaborationCommentById,
  handleCollaborationCommentUpvote,
  updateCollaborationComment,
} from '@/repository/db/collaboration_comment';
import {
  addCollaborationCommentResponse,
  deleteCollaborationCommentResponse,
  getCollaborationCommentResponseById,
  handleCollaborationCommentResponseUpvotedBy,
  updateCollaborationCommentResponse,
} from '@/repository/db/collaboration_comment_response';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import {
  addCollaborationCommentResponseSchema,
  addCollaborationCommentSchema,
  collaborationCommentResponseUpvotedBySchema,
  collaborationCommentUpvotedBySchema,
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
        const newComment = await addCollaborationComment(
          dbClient,
          body.projectId,
          body.questionId,
          user.providerId,
          body.comment,
        );
        return {
          status: StatusCodes.OK,
          data: {
            ...newComment,
            author: user,
            upvotedBy: [],
            responseCount: 0,
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
  const validatedParams = validateParams(deleteCollaborationCommentSchema, body);

  if (validatedParams.status !== StatusCodes.OK) {
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  }

  const comment = await getCollaborationCommentById(dbClient, body.commentId);

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

  await deleteCollaborationComment(dbClient, body.commentId);

  return {
    status: StatusCodes.OK,
  };
});

export const updateProjectCollaborationComment = withAuth(
  async (user: UserSession, body: { commentId: string; updatedText: string }) => {
    const validatedParams = validateParams(updateCollaborationCommentSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    }

    const comment = await getCollaborationCommentById(dbClient, body.commentId);

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

    const updatedComment = await updateCollaborationComment(dbClient, body.commentId, body.updatedText);

    return {
      status: StatusCodes.OK,
      comment: updatedComment,
    };
  },
);

export const handleProjectCollaborationCommentUpvotedBy = withAuth(
  async (user: UserSession, body: { commentId: string }) => {
    try {
      const validatedParams = validateParams(collaborationCommentUpvotedBySchema, body);
      if (validatedParams.status === StatusCodes.OK) {
        await handleCollaborationCommentUpvote(dbClient, body.commentId, user.providerId);
        return { status: StatusCodes.OK };
      }
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Adding an upvote of a Collaboration Comment ${body.commentId} for user ${user.providerId}`,
        err as Error,
        body.commentId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Upvoting the comment failed',
      };
    }
  },
);

export const addProjectCollaborationCommentResponse = withAuth(
  async (user: UserSession, body: { comment: Comment; response: string }) => {
    const validatedParams = validateParams(addCollaborationCommentResponseSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
      };
    }

    const response = await addCollaborationCommentResponse(dbClient, user.providerId, body.response, body.comment.id);
    const getUpvoters = response.upvotedBy.map(async (upvote) => await getInnoUserByProviderId(upvote));
    const upvoters = await getPromiseResults(getUpvoters);

    const createdResponse: CommentResponse = {
      ...response,
      comment: body.comment,
      upvotedBy: upvoters.filter((u) => u) as User[],
      author: {
        ...user,
      },
    };

    return {
      status: StatusCodes.OK,
      data: createdResponse,
    };
  },
);

export const deleteProjectCollaborationCommentResponse = withAuth(
  async (user: UserSession, body: { responseId: string }) => {
    const validatedParams = validateParams(deleteCollaborationCommentResponseSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    }

    const response = await getCollaborationCommentResponseById(dbClient, body.responseId);

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

    await deleteCollaborationCommentResponse(dbClient, body.responseId);

    return {
      status: StatusCodes.OK,
    };
  },
);

export const updateProjectCollaborationCommentResponse = withAuth(
  async (user: UserSession, body: { responseId: string; updatedText: string }) => {
    const validatedParams = validateParams(updateCollaborationCommentResponseSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    }

    const response = await getCollaborationCommentResponseById(dbClient, body.responseId);

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

    const updatedResponse = await updateCollaborationCommentResponse(dbClient, body.responseId, body.updatedText);

    return {
      status: StatusCodes.OK,
      comment: updatedResponse,
    };
  },
);

export const handleProjectCollaborationCommentResponseUpvotedBy = withAuth(
  async (user: UserSession, body: { responseId: string }) => {
    const validatedParams = validateParams(collaborationCommentResponseUpvotedBySchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      await handleCollaborationCommentResponseUpvotedBy(dbClient, body.responseId, user.providerId);
      return { status: StatusCodes.OK };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  },
);
