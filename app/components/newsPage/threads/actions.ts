'use server';

import { CommentType } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { addComment } from '@/services/commentService';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

const logger = getLogger();

interface AddUserComment {
  objectId: string;
  comment: string;
  commentType: CommentType;
  parentCommentId?: string;
}

export const addUserComment = withAuth(async (user: UserSession, body: AddUserComment) => {
  try {
    const { comment, commentType, objectId, parentCommentId } = body;
    const author = user;

    const createdComment = await addComment({ author, comment, commentType, objectId, parentCommentId });

    return {
      status: StatusCodes.OK,
      data: createdComment,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Adding a ${CommentType} by user ${user.providerId}`,
      err as Error,
      user.providerId,
    );
    logger.error(error);
    throw err;
  }
});
