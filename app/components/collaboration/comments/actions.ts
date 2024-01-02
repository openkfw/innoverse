'use server';
import type { CollaborationComment } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import {
  addCollaborationComment,
  getCollaborationCommentUpvotedBy,
  getCollaborationQuestionComments,
  handleCollaborationCommentUpvotedBy,
} from '@/repository/db/collaboration_comment';
import { withAuth } from '@/utils/auth';
import { getFulfilledResults, sortDateByCreatedAt } from '@/utils/helpers';
import { getInnoUserByProviderId } from '@/utils/requests';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import {
  collaborationCommentUpvotedBySchema,
  getCollaborationCommentsSchema,
  handleCollaborationCommentSchema,
} from './validationSchema';

export const handleCollaborationComment = withAuth(
  async (user: UserSession, body: { projectId: string; questionId: string; comment: string }) => {
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
        },
      };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  },
);

export const getCollaborationComments = async (body: { projectId: string; questionId: string }) => {
  const validatedParams = validateParams(getCollaborationCommentsSchema, body);

  if (validatedParams.status === StatusCodes.OK) {
    const result = await getCollaborationQuestionComments(dbClient, body.projectId, body.questionId);
    const comments = await Promise.allSettled(
      (sortDateByCreatedAt(result) as CollaborationComment[]).map(async (comment) => {
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
    return { status: StatusCodes.OK, data: comments };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
};

export const isCollaborationCommentUpvotedBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
  const validatedParams = validateParams(collaborationCommentUpvotedBySchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await getCollaborationCommentUpvotedBy(dbClient, body.commentId, user.providerId);
    return { status: StatusCodes.OK, data: result.length > 0 };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const handleCollaborationUpvotedBy = withAuth(async (user: UserSession, body: { commentId: string }) => {
  const validatedParams = validateParams(collaborationCommentUpvotedBySchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    await handleCollaborationCommentUpvotedBy(dbClient, body.commentId, user.providerId);
    return { status: StatusCodes.OK };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});
