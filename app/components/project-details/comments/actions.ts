'use server';

import { StatusCodes } from 'http-status-codes';

import { Comment, UserSession } from '@/common/types';
import {
  addComment,
  deleteComment,
  getCommentbyId,
  getComments,
  handleCommentUpvotedBy,
  updateComment,
} from '@/repository/db/project_comment';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import { getFulfilledResults, getPromiseResults, sortDateByCreatedAt } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import { isProjectCommentUpvotedByUser } from '@/utils/requests/project/requests';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import {
  commentUpvotedBySchema,
  deleteCommentSchema,
  getCommentsSchema,
  handleCommentSchema,
  updateCommentSchema,
} from './validationSchema';

const logger = getLogger();

export const addProjectComment = withAuth(async (user: UserSession, body: { projectId: string; comment: string }) => {
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

export const getProjectComments = async (body: { projectId: string }) => {
  try {
    const validatedParams = validateParams(getCommentsSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const result = await getComments(dbClient, body.projectId);

      const comments = await Promise.allSettled(
        sortDateByCreatedAt(result).map(async (comment) => {
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

      // Get user upvotes
      const getUpvotes = comments.map(async (comment): Promise<Comment> => {
        const { data: isUpvotedByUser } = await isProjectCommentUpvotedByUser({ commentId: comment.id });

        return {
          ...comment,
          isUpvotedByUser,
        };
      });

      const commentsWithUserUpvote = await getPromiseResults(getUpvotes);

      return {
        status: StatusCodes.OK,
        data: commentsWithUserUpvote,
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

export const handleProjectCommentUpvoteBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const validatedParams = validateParams(commentUpvotedBySchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const updatedComment = await handleCommentUpvotedBy(dbClient, body.commentId, user.providerId);
      return {
        status: StatusCodes.OK,
        upvotedBy: updatedComment?.upvotedBy,
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

export const deleteProjectComment = withAuth(async (user: UserSession, body: { commentId: string }) => {
  const validatedParams = validateParams(deleteCommentSchema, body);

  if (validatedParams.status !== StatusCodes.OK) {
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  }

  const comment = await getCommentbyId(dbClient, body.commentId);

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

  await deleteComment(dbClient, body.commentId);

  return {
    status: StatusCodes.OK,
  };
});

export const updateProjectComment = withAuth(
  async (user: UserSession, body: { commentId: string; updatedText: string }) => {
    const validatedParams = validateParams(updateCommentSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    }

    const comment = await getCommentbyId(dbClient, body.commentId);

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

    const updatedComment = await updateComment(dbClient, body.commentId, body.updatedText);

    return {
      status: StatusCodes.OK,
      comment: updatedComment,
    };
  },
);
