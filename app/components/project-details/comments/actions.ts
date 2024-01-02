'use server';

import type { ProjectComment } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import {
  addComment,
  getCommentUpvotedBy,
  getProjectComments,
  handleCommentUpvotedBy,
} from '@/repository/db/project_comment';
import { withAuth } from '@/utils/auth';
import { getFulfilledResults, sortDateByCreatedAt } from '@/utils/helpers';
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
      },
    };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const getComments = async (body: { projectId: string }) => {
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
        };
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
