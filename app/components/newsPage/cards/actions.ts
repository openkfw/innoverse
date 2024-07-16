'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { removeComment, updateComment } from '@/services/commentService';
import { withAuth } from '@/utils/auth';

export const updateUserComment = withAuth(
  async (
    user: UserSession,
    body: { commentId: string; content: string; commentType: 'NEWS_COMMENT' | 'POST_COMMENT' },
  ) => {
    try {
      await updateComment({
        author: user,
        commentId: body.commentId,
        content: body.content,
        commentType: body.commentType,
      });
      return {
        status: StatusCodes.OK,
      };
    } catch (err) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  },
);

export const removeUserComment = withAuth(
  async (user: UserSession, body: { commentId: string; commentType: 'NEWS_COMMENT' | 'POST_COMMENT' }) => {
    try {
      await removeComment({ user, commentId: body.commentId, commentType: body.commentType });
      return {
        status: StatusCodes.OK,
      };
    } catch (err) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  },
);
