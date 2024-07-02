'use server';

import { CommentType } from '@prisma/client';

import { ObjectType, UserSession } from '@/common/types';
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
import { notifyFollowers } from '@/utils/notification/notificationSender';
import { mapToNewsComment, mapToPostComment } from '@/utils/requests/comments/mapping';

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
  commentId: string;
  commentType: CommentType;
  content: string;
}

export const addComment = async ({ author, objectId, comment, commentType, parentCommentId }: AddComment) => {
  switch (commentType) {
    case 'POST_COMMENT':
      const postCommentDb = await addPostCommentToDb(dbClient, objectId, author.providerId, comment, parentCommentId);
      updatePostCommentInCache(postCommentDb, author);
      notifyPostFollowers(objectId);
      return await mapToPostComment(postCommentDb);
    case 'NEWS_COMMENT':
      const newsCommentDb = await addNewsCommentToDb(dbClient, objectId, author.providerId, comment, parentCommentId);
      updateNewsCommentInCache(newsCommentDb);
      notifyUpdateFollowers(objectId);
      return await mapToNewsComment(newsCommentDb);
    default:
      throw Error(`Failed to add comment: Unknown comment type '${commentType}'`);
  }
};

export const updateComment = async ({ commentId, content, commentType }: UpdateComment) => {
  switch (commentType) {
    case 'POST_COMMENT':
      const postCommentDb = await updatePostCommentInDb(dbClient, commentId, content);
      return await mapToPostComment(postCommentDb);
    case 'NEWS_COMMENT':
      const newsCommentDb = await updateNewsCommentInDb(dbClient, commentId, content);
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
  return await updatePostInCache({ post: { id: postComment.postId, responseCount: postResponseCount }, user: author });
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
  const follows = await getFollowers(dbClient, ObjectType.UPDATE, updateId);
  await notifyFollowers(follows, 'update', 'Jemand hat auf einen Post, dem du folgst, kommentiert.', '/news');
};

const notifyPostFollowers = async (postId: string) => {
  const follows = await getFollowers(dbClient, ObjectType.POST, postId);
  await notifyFollowers(follows, 'post', 'Jemand hat auf einen Post, dem du folgst, kommentiert.', '/news');
};
