'use server';

import { StatusCodes } from 'http-status-codes';

import { CommentWithResponses, CommonCommentProps, ObjectType, UserSession } from '@/common/types';
import { getCommentById, getCommentsByObjectIdAndType } from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapCommentWithResponsesToRedisNewsComments } from '@/utils/newsFeed/redis/mappings';
import { RedisNewsFeedEntry } from '@/utils/newsFeed/redis/models';
import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';
import { saveComments } from '@/utils/newsFeed/redis/services/commentsService';
import { mapToComment } from '@/utils/requests/comments/mapping';

const logger = getLogger();

export const getCommentsByObjectId = withAuth(
  async (user: UserSession, body: { objectId: string; objectType: ObjectType; limit?: number }) => {
    try {
      const commentsWithResponses = await getCommentsByObjectIdWithResponses(
        body.objectId,
        body.objectType,
        body.limit,
        user.providerId,
      );
      return {
        status: StatusCodes.OK,
        data: commentsWithResponses,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Getting comments for object with id: ${body.objectId}`,
        err as Error,
        body.objectId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Getting comments for object failed',
      };
    }
  },
);

export const getRedisNewsCommentsWithResponses = async (objectId: string, objectType: ObjectType) => {
  try {
    const { comments: commentsWithResponses } = await getCommentsByObjectIdWithResponses(objectId, objectType);
    return mapCommentWithResponsesToRedisNewsComments(commentsWithResponses);
  } catch (err) {
    const error: InnoPlatformError = dbError(`Getting news comment by id: ${objectId}`, err as Error, objectId);
    logger.error(error);
    throw err;
  }
};

export const getCommentsByObjectIdWithResponses = async (
  objectId: string,
  objectType: ObjectType,
  limit?: number,
  userId?: string,
) => {
  const { comments: dbComments, totalCount } = await getCommentsByObjectIdAndType(
    dbClient,
    objectId,
    objectType,
    limit,
  );

  const comments = await Promise.all(dbComments.map((comment) => mapToComment(comment, userId)));
  return { comments: setResponses(comments), totalCount };
};

const setResponses = (comments: CommonCommentProps[]) => {
  const rootComments: CommentWithResponses[] = comments
    .filter((comment) => !comment.parentId)
    .map((comment) => ({ ...comment, comments: [] }));

  let queue = rootComments;

  while (queue.length) {
    queue.forEach((comment) => {
      comment.comments = getResponsesForComment(comments, comment);
    });
    queue = queue.flatMap((comment) => comment.comments);
  }

  return rootComments;
};

export const getCommentWithResponses = async (commentId: string) => {
  try {
    const comment = await getCommentById(dbClient, commentId);
    if (!comment) {
      throw Error(`Failed to find a comment with id: ${commentId}`);
    }
    const mappedComment = await mapToComment(comment);
    const commentWithResponses = setResponses([mappedComment]);
    return commentWithResponses;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting news comments for comment with id: ${commentId}`,
      err as Error,
      commentId,
    );
    logger.error(error);
    throw err;
  }
};

const getResponsesForComment = (
  comments: CommonCommentProps[],
  rootComment: CommentWithResponses,
): CommentWithResponses[] => {
  return comments
    .filter((comment) => comment.parentId === rootComment.id)
    .map((response) => ({ ...response, comments: [] }));
};

async function saveEntryNewsComments(entry: RedisNewsFeedEntry, objectType: ObjectType) {
  const redisClient = await getRedisClient();
  const comments = await getRedisNewsCommentsWithResponses(entry.item.id, objectType);
  if (comments.length > 0) {
    return await saveComments(redisClient, entry, comments);
  }
  return [];
}

export async function saveNewsFeedEntriesComments(newsFeedEntries: RedisNewsFeedEntry[], objectType: ObjectType) {
  await Promise.all(
    newsFeedEntries.map(async (entry) => {
      try {
        logger.info(`Saving comments for entry ${entry.item.id} of type ${objectType}`);
        const comments = await saveEntryNewsComments(entry, objectType);
        entry.item.comments = comments;
      } catch (err) {
        logger.error(`Failed to save comments for entry ${entry.item.id} of type ${objectType}`, err);
      }
    }),
  );
}
