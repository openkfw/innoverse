'use server';

import { CommentType } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { addComment } from '@/services/commentService';
import { withAuth } from '@/utils/auth';

interface AddUserComment {
  objectId: string;
  comment: string;
  commentType: CommentType;
  parentCommentId?: string;
}

export const addUserComment = withAuth(async (user: UserSession, body: AddUserComment) => {
  const { comment, commentType, objectId, parentCommentId } = body;
  const author = user;

  const createdComment = await addComment({ author, comment, commentType, objectId, parentCommentId });

  return {
    status: StatusCodes.OK,
    data: createdComment,
  };
});
