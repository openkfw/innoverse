import { PrismaClient } from '@prisma/client';

import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

const logger = getLogger();

//todo use the comments.ts instead of these queries

export async function addCollaborationCommentResponseToDb(
  client: PrismaClient,
  author: string,
  response: string,
  commentId: string,
) {
  try {
    return client.collaborationCommentResponse.create({
      data: {
        author: author,
        response: response,
        commentId: commentId,
      },
    });
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Add collaboration comment to comment with id: ${commentId} by user: ${author}`,
      err as Error,
      commentId,
    );
    logger.error(error);
    throw err;
  }
}
