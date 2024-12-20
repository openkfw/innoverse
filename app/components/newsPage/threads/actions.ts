'use server';

import { CommentType } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { ObjectType, UserSession } from '@/common/types';
import { addComment } from '@/services/commentService';
import { withAuth } from '@/utils/auth';

interface AddUserComment {
  objectId: string;
  objectType: ObjectType;
  comment: string;
  commentType: CommentType;
  parentCommentId?: string;
  projectId?: string;
}

export const addUserComment = withAuth(async (user: UserSession, body: AddUserComment) => {
  const { comment, commentType, objectId, objectType, parentCommentId, projectId } = body;
  const author = user;

  const createdComment = await addComment({
    author,
    comment,
    commentType,
    objectId,
    objectType,
    parentCommentId,
    projectId,
  });

  return {
    status: StatusCodes.OK,
    data: createdComment,
  };
});
