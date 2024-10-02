'use server';

import { CommentType } from '@prisma/client';

import { NewsComment, ObjectType, PostComment, UserSession } from '@/common/types';
import { getFollowers } from '@/repository/db/follow';
import {
  addNewsCommentToDb,
  countNewsResponses,
  deleteNewsCommentInDb,
  updateNewsCommentInDb,
} from '@/repository/db/news_comment';
import {
  addPostCommentToDb,
  countPostResponses,
  deletePostCommentInDb,
  updatePostCommentInDb,
} from '@/repository/db/post_comment';
import dbClient from '@/repository/db/prisma/prisma';
import { updatePostInCache } from '@/services/postService';
import { updateProjectUpdateInCache } from '@/services/updateService';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { notifyFollowers } from '@/utils/notification/notificationSender';
import { mapToNewsComment, mapToPostComment } from '@/utils/requests/comments/mapping';

const logger = getLogger();

interface AddComment {
  author: UserSession;
  objectId: string;
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
  author: UserSession;
  commentId: string;
  commentType: CommentType;
  content: string;
}

export const addComment = async (body: AddComment): Promise<NewsComment | PostComment> => {
  const { comment, commentType, author, objectId, parentCommentId } = body;

  switch (commentType) {
    case 'POST_COMMENT':
      const postCommentDb = await addPostCommentToDb(dbClient, objectId, author.providerId, comment, parentCommentId);
      updatePostCommentInCache(postCommentDb, author);
      notifyPostFollowers(objectId);
      const postComment = await mapToPostComment(postCommentDb);
      return postComment;
    case 'NEWS_COMMENT':
      const newsCommentDb = await addNewsCommentToDb(dbClient, objectId, author.providerId, comment, parentCommentId);
      updateNewsCommentInCache(newsCommentDb);
      notifyUpdateFollowers(objectId);
      const newsComment = await mapToNewsComment(newsCommentDb);
      return newsComment;
    default:
      throw Error(`Failed to add comment: Unknown comment type '${commentType}'`);
  }
};

export const updateComment = async ({ author, commentId, content, commentType }: UpdateComment) => {
  switch (commentType) {
    case 'POST_COMMENT':
      const postCommentDb = await updatePostCommentInDb(dbClient, commentId, content);
      await updatePostCommentInCache(postCommentDb, author);
      return await mapToPostComment(postCommentDb);
    case 'NEWS_COMMENT':
      const newsCommentDb = await updateNewsCommentInDb(dbClient, commentId, content);
      await updateNewsCommentInCache(newsCommentDb);
      return await mapToNewsComment(newsCommentDb);
    default:
      throw Error(`Failed to add comment: Unknown comment type '${commentType}'`);
  }
};

export const removeComment = async ({ user, commentId, commentType }: RemoveComment) => {
  switch (commentType) {
    case 'POST_COMMENT':
      const postCommentInDb = await deletePostCommentInDb(dbClient, commentId);
      const postId = postCommentInDb.postComment?.postId;
      if (postId) {
        await removePostCommentInCache(postId, user);
      }
      return;
    case 'NEWS_COMMENT':
      const newsCommentInDb = await deleteNewsCommentInDb(dbClient, commentId);
      const updateId = newsCommentInDb.newsComment?.newsId;
      if (updateId) {
        await removeNewsCommenInCache(updateId);
      }
      return;
    default:
      throw Error(`Failed to remove comment: Unknown comment type '${commentType}'`);
  }
};

const updatePostCommentInCache = async (postComment: { postId: string }, author: UserSession) => {
  const postResponseCount = await countPostResponses(dbClient, postComment.postId);
  return await updatePostInCache({
    post: { id: postComment.postId, responseCount: postResponseCount },
    user: author,
  });
};

const updateNewsCommentInCache = async (newsComment: { newsId: string }) => {
  const newsResponseCount = await countNewsResponses(dbClient, newsComment.newsId);
  await updateProjectUpdateInCache({ update: { id: newsComment.newsId, responseCount: newsResponseCount } });
};

const removePostCommentInCache = async (postId: string, user: UserSession) => {
  if (postId) {
    const responseCount = await countPostResponses(dbClient, postId);
    await updatePostInCache({ post: { id: postId, responseCount }, user });
  }
};

const removeNewsCommenInCache = async (newsId: string) => {
  if (newsId) {
    const responseCount = await countNewsResponses(dbClient, newsId);
    await updateProjectUpdateInCache({ update: { id: newsId, responseCount } });
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
