'use server';

import { StatusCodes } from 'http-status-codes';

import { ObjectType, UserSession } from '@/common/types';
import { addComment } from '@/services/commentService';
import { withAuth } from '@/utils/auth';

interface AddUserComment {
  objectId: string;
  comment: string;
  objectType: ObjectType;
  parentCommentId?: string;
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

// export const addCommentLike = withAuth(async (user: UserSession, commentId: string) => {
//   const author = user;

//   await addLike({ author, commentId });
//   return { status: StatusCodes.OK };
// });

// export const deleteCommentLike = withAuth(async (user: UserSession, commentId: string) => {
//   const author = user;

//   await deleteLike({ author, commentId });
//   return { status: StatusCodes.OK };
// });
