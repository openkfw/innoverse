'use server';

import { StatusCodes } from 'http-status-codes';

import { ObjectType, UserSession } from '@/common/types';
import { removeComment, updateComment } from '@/services/commentService';
import { withAuth } from '@/utils/auth';

export const updateUserComment = withAuth(
  async (user: UserSession, body: { commentId: string; content: string; objectType: ObjectType }) => {
    try {
      await updateComment({
        commentId: body.commentId,
        content: body.content,
        author: user,
      });
      return {
        status: StatusCodes.OK,
        data: {},
      };
    } catch (err) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  },
);

export const removeUserComment = async (body: { commentId: string; objectType: ObjectType }) => {
  try {
    await removeComment({ commentId: body.commentId });
    return {
      status: StatusCodes.OK,
    };
  } catch (err) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};
