'use server';
import { CommentWithResponses, CommonCommentProps, ObjectType } from '@/common/types';
import { getNewsCommentsByUpdateId } from '@/repository/db/news_comment';
import { getNewsCommentsByPostId, getPostCommentById } from '@/repository/db/post_comment';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapToRedisNewsComments } from '@/utils/newsFeed/redis/mappings';
import { saveComments } from '@/utils/newsFeed/redis/services/commentsService';
import { mapToNewsComment, mapToPostComment } from '@/utils/requests/comments/mapping';
import dbClient from '@/repository/db/prisma/prisma';
import { NewsType, RedisNewsFeedEntry } from '@/utils/newsFeed/redis/models';
import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';

const logger = getLogger();

export const getNewsCommentsProjectUpdateId = async (updateId: string) => {
  try {
    const dbComments = await getNewsCommentsByUpdateId(dbClient, updateId);
    const mapComments = dbComments.map(mapToNewsComment);
    const comments = await Promise.all(mapComments);
    const commentsWithResponses = setResponses(comments);
    return commentsWithResponses;
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting news comments for project update with id: ${updateId}`,
      err as Error,
      updateId,
    );
    logger.error(error);
    throw err;
  }
};

export const getPostCommentsByPostId = async (postId: string) => {
  try {
    const dbComments = await getNewsCommentsByPostId(dbClient, postId);
    const mapComments = dbComments.map(mapToPostComment);
    const comments = await Promise.all(mapComments);
    const commentsWithResponses = setResponses(comments);
    return commentsWithResponses;
  } catch (err) {
    const error: InnoPlatformError = dbError(`Getting news comments for post with id: ${postId}`, err as Error, postId);
    logger.error(error);
    throw err;
  }
};

export const getRedisNewsCommentsWithResponses = async (newsId: string, newsType: NewsType | ObjectType) => {
  try {
    if (newsType === NewsType.POST) {
      const comments = await getPostCommentsByPostId(newsId);
      return mapToRedisNewsComments(comments);
    }
    const comments = await getNewsCommentsProjectUpdateId(newsId);
    return mapToRedisNewsComments(comments);
  } catch (err) {
    const error: InnoPlatformError = dbError(`Getting news comment by id: ${newsId}`, err as Error, newsId);
    logger.error(error);
    throw err;
  }
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
    const comment = await getPostCommentById(dbClient, commentId);
    if (!comment) {
      throw Error(`Failed to find a comment with id: ${commentId}`);
    }
    const mappedComment = await mapToPostComment(comment);
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
    .filter((comment) => comment.parentId === rootComment.commentId)
    .map((response) => ({ ...response, comments: [] }));
};

export async function saveEntryNewsComments(entry: RedisNewsFeedEntry) {
  const redisClient = await getRedisClient();
  const comments = await getRedisNewsCommentsWithResponses(entry.item.id, entry.type);
  if (comments.length > 0) {
    return await saveComments(redisClient, entry, comments);
  }
  return [];
}
