'use server';

import { StatusCodes } from 'http-status-codes';

import { ObjectType, UserSession } from '@/common/types';
import { addComment } from '@/services/commentService';
import { withAuth } from '@/utils/auth';
import dbClient from '../../../repository/db/prisma/prisma';
import { addCommentLike as addCommentLikeToDB, deleteCommentAndUserLike } from '@/repository/db/comment_like';

interface AddUserComment {
  objectId: string;
  objectType: ObjectType;
  comment: string;
  parentCommentId?: string;
  projectId?: string;
}

export const addUserComment = withAuth(async (user: UserSession, body: AddUserComment) => {
  const { comment, objectType, objectId, parentCommentId } = body;
  const author = user;

  const createdComment = await addComment({ author, comment, objectType, objectId, parentCommentId });

  return {
    status: StatusCodes.OK,
    data: createdComment,
  };
});

export const addCommentLike = withAuth(async (user: UserSession, commentId: string) => {
  await addCommentLikeToDB(dbClient, commentId, user.providerId);

  return { status: StatusCodes.OK };
});

export const deleteCommentLike = withAuth(async (user: UserSession, commentId: string) => {
  await deleteCommentAndUserLike(dbClient, commentId, user.providerId);
  return { status: StatusCodes.OK };
});
