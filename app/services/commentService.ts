'use server';

import { CommentType } from '@prisma/client';

import { NewsComment, NewsFeedEntry, ObjectType, PostComment, UserSession } from '@/common/types';
import { getFollowers } from '@/repository/db/follow';
import { addNewsCommentToDb, deleteNewsCommentInDb, updateNewsCommentInDb } from '@/repository/db/news_comment';
import { addPostCommentToDb, deletePostCommentInDb, updatePostCommentInDb } from '@/repository/db/post_comment';
import dbClient from '@/repository/db/prisma/prisma';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { notifyFollowers } from '@/utils/notification/notificationSender';
import { mapToNewsComment, mapToPostComment } from '@/utils/requests/comments/mapping';
import {
  addNewsCommentToCache,
  deleteNewsCommentInCache,
  updateNewsCommentInCache,
} from '@/utils/newsFeed/redis/services/commentsService';
import { NewsType } from '@/utils/newsFeed/redis/models';
import { getNewsTypeByString, mapToRedisComment } from '@/utils/newsFeed/redis/mappings';

const logger = getLogger();

interface AddComment {
  author: UserSession;
  objectId: string;
  objectType: ObjectType;
  comment: string;
  commentType: CommentType;
  parentCommentId?: string;
}

interface RemoveComment {
  user: UserSession;
  commentId: string;
  commentType: CommentType;
}

interface UpdateComment {
  commentId: string;
  commentType: CommentType;
  content: string;
}

export const addComment = async (body: AddComment): Promise<NewsComment | PostComment> => {
  const { comment, commentType, author, objectId, objectType, parentCommentId } = body;

  switch (commentType) {
    case 'POST_COMMENT':
      const postCommentDb = await addPostCommentToDb(dbClient, objectId, author.providerId, comment, parentCommentId);
      const redisPostComment = await mapToRedisComment(postCommentDb);
      const postComment = await mapToPostComment(postCommentDb);
      await addNewsCommentToCache({
        newsType: getNewsTypeByString(objectType),
        newsId: objectId,
        comment: redisPostComment,
        parentId: parentCommentId,
      });
      notifyPostFollowers(objectId);
      return postComment;
    case 'NEWS_COMMENT':
      const newsCommentDb = await addNewsCommentToDb(dbClient, objectId, author.providerId, comment, parentCommentId);
      const redisNewsComment = await mapToRedisComment(newsCommentDb);
      const newsComment = await mapToNewsComment(newsCommentDb);
      await addNewsCommentToCache({
        newsType: getNewsTypeByString(objectType),
        newsId: objectId,
        comment: redisNewsComment,
        parentId: parentCommentId,
      });
      notifyUpdateFollowers(objectId);
      return newsComment;
    default:
      throw Error(`Failed to add comment: Unknown comment type '${commentType}'`);
  }
};

export const updateComment = async ({ commentId, content, commentType }: UpdateComment) => {
  switch (commentType) {
    case 'POST_COMMENT':
      const postCommentDb = await updatePostCommentInDb(dbClient, commentId, content);
      const redisPostComment = await mapToRedisComment(postCommentDb);
      await updateNewsCommentInCache(redisPostComment);
      return await mapToPostComment(postCommentDb);
    case 'NEWS_COMMENT':
      const newsCommentDb = await updateNewsCommentInDb(dbClient, commentId, content);
      const redisNewsComment = await mapToRedisComment(newsCommentDb);
      await updateNewsCommentInCache(redisNewsComment);
      return await mapToNewsComment(newsCommentDb);
    default:
      throw Error(`Failed to add comment: Unknown comment type '${commentType}'`);
  }
};

export const removeComment = async ({ commentId, commentType }: RemoveComment) => {
  switch (commentType) {
    case 'POST_COMMENT':
      const postCommentInDb = await deletePostCommentInDb(dbClient, commentId);
      const postId = postCommentInDb.postComment?.postId;
      if (postId) {
        await deleteNewsCommentInCache(NewsType.POST, postId, commentId);
      }
      return;
    case 'NEWS_COMMENT':
      const newsCommentInDb = await deleteNewsCommentInDb(dbClient, commentId);
      const updateId = newsCommentInDb.newsComment?.newsId;
      if (updateId) {
        await deleteNewsCommentInCache(NewsType.UPDATE, updateId, commentId);
      }
      return;
    default:
      throw Error(`Failed to remove comment: Unknown comment type '${commentType}'`);
  }
};

const notifyUpdateFollowers = async (updateId: string) => {
  try {
    const follows = await getFollowers(dbClient, ObjectType.UPDATE, updateId);
    await notifyFollowers(follows, 'update', 'Jemand hat auf einen Post, dem du folgst, kommentiert.', '/news');
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Notify followers about updated update with id: ${updateId}`,
      err as Error,
      updateId,
    );
    logger.error(error);
    throw err;
  }
};

const notifyPostFollowers = async (postId: string) => {
  try {
    const follows = await getFollowers(dbClient, ObjectType.POST, postId);
    await notifyFollowers(follows, 'post', 'Jemand hat auf einen Post, dem du folgst, kommentiert.', '/news');
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Notify followers about updated post with id: ${postId}`,
      err as Error,
      postId,
    );
    logger.error(error);
    throw err;
  }
};
