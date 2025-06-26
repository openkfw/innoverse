'use server';

import { StatusCodes } from 'http-status-codes';

import { ObjectType, UserSession } from '@/common/types';
import { addCommentLike as addCommentLikeToDB, deleteCommentAndUserLike } from '@/repository/db/comment_like';
import { addComment } from '@/services/commentService';
import { withAuth } from '@/utils/auth';

import dbClient from '../../../repository/db/prisma/prisma';

interface AddUserComment {
  objectId: string;
  objectType: ObjectType;
  comment: string;
  parentCommentId?: string;
  projectId?: string;
  anonymous?: boolean;
  additionalObjectId?: string;
  additionalObjectType?: ObjectType;
}

export const addUserComment = withAuth(async (user: UserSession, body: AddUserComment) => {
  const { comment, objectType, objectId, parentCommentId, anonymous, additionalObjectId, additionalObjectType } = body;
  const author = user;
  const createdComment = await addComment({
    author,
    comment,
    objectType,
    objectId,
    parentCommentId,
    anonymous,
    additionalObjectId,
    additionalObjectType,
  });

  return {
    status: StatusCodes.OK,
    data: createdComment,
  };
});

export const addCommentLike = withAuth(async (user: UserSession, commentId: string) => {
  const data = await addCommentLikeToDB(dbClient, commentId, user.providerId);
  return { status: StatusCodes.OK, data };
});

export const deleteCommentLike = withAuth(async (user: UserSession, commentId: string) => {
  const data = await deleteCommentAndUserLike(dbClient, commentId, user.providerId);
  return { status: StatusCodes.OK, data };
});
