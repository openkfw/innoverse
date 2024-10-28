'use server';
import { CommentWithResponses, CommonCommentProps } from '@/common/types';
import { getNewsCommentsByUpdateId } from '@/repository/db/news_comment';
import { getNewsCommentsByPostId, getPostCommentById } from '@/repository/db/post_comment';
import dbClient from '@/repository/db/prisma/prisma';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapToRedisNewsComments } from '@/utils/newsFeed/redis/mappings';
import { mapToNewsComment, mapToPostComment } from '@/utils/requests/comments/mapping';

const logger = getLogger();

export const getNewsCommentProjectUpdateId = async (updateId: string) => {
  try {
    const dbComments = await getNewsCommentsByUpdateId(dbClient, updateId);
    const mapComments = dbComments.map(mapToNewsComment);
    const comments = await Promise.all(mapComments);
    const commensWithResponses = setResponses(comments);
    return commensWithResponses;
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

export const getRedisNewsCommentsById = async (newsId: string) => {
  const comments = await getNewsCommentProjectUpdateId(newsId);
  return await mapToRedisNewsComments(comments);
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

export const getRedisPostCommentsByPostId = async (postId: string) => {
  const comments = await getPostCommentsByPostId(postId);
  return await mapToRedisNewsComments(comments);
};

const setResponses = (comments: CommonCommentProps[]) => {
  const rootComments: CommentWithResponses[] = comments
    .filter((comment) => !comment.parentId)
    .map((comment) => ({ ...comment, responses: [] }));

  let queue = rootComments;

  while (queue.length) {
    queue.forEach((comment) => {
      comment.responses = getResponsesForComment(comments, comment);
    });
    queue = queue.flatMap((comment) => comment.responses);
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
    .map((response) => ({ ...response, responses: [] }));
};
