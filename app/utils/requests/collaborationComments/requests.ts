'use server';

import { User } from 'next-auth';
import { StatusCodes } from 'http-status-codes';

import { CollaborationComment, Comment, CommentResponse, UserSession } from '@/common/types';
import {
  collaborationCommentResponseUpvotedBySchema,
  getCollaborationCommentResponsesSchema,
  getCollaborationCommentsSchema,
} from '@/components/collaboration/comments/validationSchema';
import { getCollaborationQuestionComments } from '@/repository/db/collaboration_comment';
import {
  getCollaborationCommentResponseCount,
  getCollaborationCommentResponsesByCommentId,
  getCollaborationCommentResponseUpvotedBy,
} from '@/repository/db/collaboration_comment_response';
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
      const questionComments = await getCollaborationQuestionComments(dbClient, body.projectId, body.questionId);
      const sortedComments = sortDateByCreatedAtAsc(questionComments);

      const getComments = sortedComments.map(async (comment) => {
        const author = await getInnoUserByProviderId(comment.author);
        const getUpvotes = comment.upvotedBy.map(async (upvote) => await getInnoUserByProviderId(upvote));
        const upvotes = await getPromiseResults(getUpvotes);
        const commentCount = await getCollaborationCommentResponseCount(dbClient, comment.id);

        return {
          ...comment,
          author: author,
          upvotedBy: upvotes,
          commentCount: commentCount,
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

export const getProjectCollaborationCommentResponses = async (body: { comment: Comment | CollaborationComment }) => {
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
    const upvoters = await getPromiseResults(getUpvoters);
    const author = await getInnoUserByProviderId(response.author);

    return {
      ...response,
      author: author,
      comment: body.comment,
      upvotedBy: upvoters.filter((u) => u) as User[],
    };
  });

  const commentResponses = (await getPromiseResults(responsePromises)) as CommentResponse[];

  return {
    status: StatusCodes.OK,
    data: sortDateByCreatedAtAsc(commentResponses),
  };
};

export const isProjectCollaborationCommentResponseUpvotedBy = withAuth(
  async (user: UserSession, body: { responseId: string }) => {
    try {
      const validatedParams = validateParams(collaborationCommentResponseUpvotedBySchema, body);
      if (validatedParams.status === StatusCodes.OK) {
        const result = await getCollaborationCommentResponseUpvotedBy(dbClient, body.responseId, user.providerId);
        return {
          status: StatusCodes.OK,
          data: result.length > 0,
        };
      }
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Checking if user ${user.providerId} has upvoted response ${body.responseId}`,
        err as Error,
        user.providerId,
      );
      logger.error(error);
      throw err;
    }
  },
);
