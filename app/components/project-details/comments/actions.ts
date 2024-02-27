'use server';

import type { ProjectComment } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { Comment, UserSession } from '@/common/types';
import {
  addComment,
  getCommentUpvotedBy,
  getProjectComments,
  handleCommentUpvotedBy,
} from '@/repository/db/project_comment';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import { getFulfilledResults, sortDateByCreatedAt } from '@/utils/helpers';
import logger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import { commentUpvotedBySchema, getCommentsSchema, handleCommentSchema } from './validationSchema';

export const handleComment = withAuth(async (user: UserSession, body: { projectId: string; comment: string }) => {
  try {
    const validatedParams = validateParams(handleCommentSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const newComment = await addComment(dbClient, body.projectId, user.providerId, body.comment);
      return {
        status: StatusCodes.OK,
        data: {
          ...newComment,
          author: user,
          upvotedBy: [],
          responseCount: 0,
          questionId: '',
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
      `Adding a Comment to a Project ${body.projectId} from user ${user.providerId}`,
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

export const getComments = async (body: { projectId: string }) => {
  try {
    const validatedParams = validateParams(getCommentsSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const result = await getProjectComments(dbClient, body.projectId);

      const comments = await Promise.allSettled(
        (sortDateByCreatedAt(result) as ProjectComment[]).map(async (comment) => {
          const author = await getInnoUserByProviderId(comment.author);
          const upvotes = await Promise.allSettled(
            comment.upvotedBy.map(async (upvote) => await getInnoUserByProviderId(upvote)),
          ).then((results) => getFulfilledResults(results));

          return {
            ...comment,
            upvotedBy: upvotes,
            author,
          } as Comment;
        }),
      ).then((results) => getFulfilledResults(results));

      return {
        status: StatusCodes.OK,
        data: comments,
      };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError('Getting Project Comments', err as Error, body.projectId);
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting Project Comments failed',
    };
  }
};

export const isCommentUpvotedBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const validatedParams = validateParams(commentUpvotedBySchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const result = await getCommentUpvotedBy(dbClient, body.commentId, user.providerId);
      return {
        status: StatusCodes.OK,
        data: result.length > 0,
      };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Checking the upvote status of a Comment ${body.commentId} for user ${user.providerId}`,
      err as Error,
      body.commentId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Checking the upvote status failed',
    };
  }
});

export const handleUpvotedBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const validatedParams = validateParams(commentUpvotedBySchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      await handleCommentUpvotedBy(dbClient, body.commentId, user.providerId);
      return {
        status: StatusCodes.OK,
      };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Adding an upvote of a Comment ${body.commentId} for user ${user.providerId}`,
      err as Error,
      body.commentId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Upvoting comment failed',
    };
  }
});
