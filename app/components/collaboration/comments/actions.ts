'use server';
import type { CollaborationComment } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { Comment, CommentResponse, User, UserSession } from '@/common/types';
import {
  addCollaborationComment,
  getCollaborationCommentUpvotedBy,
  getCollaborationQuestionComments,
  handleCollaborationCommentUpvotedBy,
} from '@/repository/db/collaboration_comment';
import {
  addCollaborationCommentResponse,
  getCollaborationCommentResponseCount,
  getCollaborationCommentResponsesByCommentId,
  getCollaborationCommentResponseUpvotedBy,
  handleCollaborationCommentResponseUpvotedBy,
} from '@/repository/db/collaboration_comment_response';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import { getFulfilledPromiseResults, getFulfilledResults, sortDateByCreatedAt } from '@/utils/helpers';
import logger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import {
  collaborationCommentResponseUpvotedBySchema,
  collaborationCommentUpvotedBySchema,
  getCollaborationCommentResponsesSchema,
  getCollaborationCommentsSchema,
  handleCollaborationCommentResponseSchema,
  handleCollaborationCommentSchema,
} from './validationSchema';

export const getCollaborationCommentResponses = withAuth(async (user: UserSession, body: { comment: Comment }) => {
  const validatedParams = validateParams(getCollaborationCommentResponsesSchema, body);

  if (validatedParams.status !== StatusCodes.OK) {
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  }

  const responses = await getCollaborationCommentResponsesByCommentId(dbClient, body.comment.id);

  const responsePromises = responses.map(async (response) => {
    const getUpvoters = response.upvotedBy.map(async (upvote) => await getInnoUserByProviderId(upvote));
    const upvoters = await getFulfilledPromiseResults(getUpvoters);
    const author = await getInnoUserByProviderId(response.author);

    return {
      ...response,
      author: author,
      comment: body.comment,
      upvotedBy: upvoters.filter((u) => u) as User[],
    };
  });

  const commentResponses = (await getFulfilledPromiseResults(responsePromises)) as CommentResponse[];

  return {
    status: StatusCodes.OK,
    data: sortDateByCreatedAt(commentResponses),
  };
});

export const handleCollaborationCommentResponse = withAuth(
  async (user: UserSession, body: { comment: Comment; response: string }) => {
    const validatedParams = validateParams(handleCollaborationCommentResponseSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
      };
    }

    const response = await addCollaborationCommentResponse(dbClient, user.providerId, body.response, body.comment.id);
    const getUpvoters = response.upvotedBy.map(async (upvote) => await getInnoUserByProviderId(upvote));
    const upvoters = await getFulfilledPromiseResults(getUpvoters);

    const createdResponse: CommentResponse = {
      ...response,
      comment: body.comment,
      upvotedBy: upvoters.filter((u) => u) as User[],
      author: {
        name: user.name,
        email: user.email,
        id: user.providerId,
        role: user.role,
        department: user.department,
        image: user.image,
        badge: false,
      },
    };

    return {
      status: StatusCodes.OK,
      data: createdResponse,
    };
  },
);

export const handleCollaborationComment = withAuth(
  async (user: UserSession, body: { projectId: string; questionId: string; comment: string }) => {
    try {
      const validatedParams = validateParams(handleCollaborationCommentSchema, body);
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

export const getCollaborationComments = async (body: { projectId: string; questionId: string }) => {
  try {
    const validatedParams = validateParams(getCollaborationCommentsSchema, body);

    if (validatedParams.status === StatusCodes.OK) {
      const result = await getCollaborationQuestionComments(dbClient, body.projectId, body.questionId);
      const comments = await Promise.allSettled(
        (sortDateByCreatedAt(result) as CollaborationComment[]).map(async (comment) => {
          const author = await getInnoUserByProviderId(comment.author);
          const getUpvotes = comment.upvotedBy.map(async (upvote) => await getInnoUserByProviderId(upvote));
          const upvotes = await getFulfilledPromiseResults(getUpvotes);
          const responseCount = await getCollaborationCommentResponseCount(dbClient, comment.id);

          return {
            ...comment,
            author: author,
            upvotedBy: upvotes,
            responseCount: responseCount,
          };
        }),
      ).then((results) => getFulfilledResults(results));
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

export const isCollaborationCommentUpvotedBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const validatedParams = validateParams(collaborationCommentUpvotedBySchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const result = await getCollaborationCommentUpvotedBy(dbClient, body.commentId, user.providerId);
      return { status: StatusCodes.OK, data: result.length > 0 };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Checking the upvote status of a Collaboration Comment ${body.commentId} for user ${user.providerId}`,
      err as Error,
      body.commentId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Checking the upvote status of comment failed',
    };
  }
});

export const handleCollaborationUpvotedBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const validatedParams = validateParams(collaborationCommentUpvotedBySchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      await handleCollaborationCommentUpvotedBy(dbClient, body.commentId, user.providerId);
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
});

export const isCollaborationResponseUpvotedBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
  const validatedParams = validateParams(collaborationCommentResponseUpvotedBySchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await getCollaborationCommentResponseUpvotedBy(dbClient, body.commentId, user.providerId);
    return {
      status: StatusCodes.OK,
      data: result.length > 0,
    };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const handleCollaborationResponseUpvotedBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
  const validatedParams = validateParams(collaborationCommentResponseUpvotedBySchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    await handleCollaborationCommentResponseUpvotedBy(dbClient, body.commentId, user.providerId);
    return { status: StatusCodes.OK };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});
