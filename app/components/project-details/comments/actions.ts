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
import { AuthResponse, withAuth } from '@/utils/auth';
import { getFulfilledPromiseResults, getFulfilledResults, sortDateByCreatedAt } from '@/utils/helpers';
import { getInnoUserByProviderId } from '@/utils/requests';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import { commentUpvotedBySchema, getCommentsSchema, handleCommentSchema } from './validationSchema';

export const handleComment = withAuth(async (user: UserSession, body: { projectId: string; comment: string }) => {
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
  };
});

export const getComments = async (body: { projectId: string }): Promise<AuthResponse<Comment[]>> => {
  const validatedParams = validateParams(getCommentsSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await getProjectComments(dbClient, body.projectId);

    const comments = await Promise.allSettled(
      (sortDateByCreatedAt(result) as ProjectComment[]).map(async (comment) => {
        const author = await getInnoUserByProviderId(comment.author);
        const getUpvotes = comment.upvotedBy.map(async (upvote) => await getInnoUserByProviderId(upvote));
        const upvotes = await getFulfilledPromiseResults(getUpvotes);

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
  };
};

export const isCommentUpvotedBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
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
  };
});

export const handleUpvotedBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
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
  };
});
