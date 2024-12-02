'use server';

import { ObjectType } from '@prisma/client';

import { NewsComment, PostComment, UserSession } from '@/common/types';
import { addCommentToDb, countComments, deleteCommentInDb, updateCommentInDb } from '@/repository/db/comment';
import { getFollowers } from '@/repository/db/follow';
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
  objectType: ObjectType;
  parentCommentId?: string;
}

interface RemoveComment {
  user: UserSession;
  commentId: string;
}

interface UpdateComment {
  author: UserSession;
  commentId: string;
  content: string;
}

//todo refactor this

export const addComment = async (body: AddComment): Promise<NewsComment | PostComment> => {
  const { comment, objectType, author, objectId, parentCommentId } = body;

  // switch (objectType) {
  //   case 'POST_COMMENT':
  //     const postCommentDb = await addCommentToDb({
  //       client: dbClient,
  //       objectId,
  //       objectType: 'POST',
  //       author: author.providerId,
  //       text: comment,
  //       parent: parentCommentId,
  //     });
  //     updatePostCommentInCache(postCommentDb, author);
  //     notifyPostFollowers(objectId);
  //     const postComment = await mapToPostComment(postCommentDb);
  //     return postComment;
  //   case 'NEWS_COMMENT':
  //     const newsCommentDb = await addCommentToDb(
  //       dbClient,
  //       objectId,
  //       'UPDATE',
  //       author.providerId,
  //       comment,
  //       parentCommentId,
  //     );
  //     updateNewsCommentInCache(newsCommentDb);
  //     notifyUpdateFollowers(objectId);
  //     const newsComment = await mapToNewsComment(newsCommentDb);
  //     return newsComment;
  //   default:
  //     throw Error(`Failed to add comment: Unknown comment type '${commentType}'`);
  // }
  const result = await addCommentToDb({
    client: dbClient,
    objectId,
    objectType,
    author: author.providerId,
    text: comment,
    parentId: parentCommentId,
  });
  updateCommentInCache({ objectId, objectType: result.objectType }, author);
  notifyPostFollowers(objectId);
};

//todo refactor to not have 2 cases
export const updateComment = async ({ author, commentId, content }: UpdateComment) => {
  // switch (commentType) {
  //   case 'POST_COMMENT':
  //     const postCommentDb = await updateCommentInDb(dbClient, commentId, content);
  //     await updateCommentInCache(postCommentDb, author);
  //     return await mapToPostComment(postCommentDb);
  //   case 'NEWS_COMMENT':
  //     const newsCommentDb = await updateCommentInDb(dbClient, commentId, content);
  //     await updateCommentInCache(newsCommentDb);
  //     return await mapToNewsComment(newsCommentDb);
  //   default:
  //     throw Error(`Failed to add comment: Unknown comment type '${commentType}'`);
  // }

  const result = await updateCommentInDb(dbClient, commentId, content);
  await updateCommentInCache({ objectId: result.objectId, objectType: result.objectType }, author);
  return result;
};

//todo refactor to not have 2 cases
export const removeComment = async ({ user, commentId }: RemoveComment) => {
  const result = await deleteCommentInDb(dbClient, commentId);
  const objectId = result.objectId;
  if (objectId) {
    await removeCommentInCache({ objectId, objectType: result.objectType }, user);
  }
};

//todo refactor to only use one of the updatePostCommentInCache and updateNewsCommentInCache

const updateCommentInCache = async (comment: { objectId: string; objectType: ObjectType }, author: UserSession) => {
  const commentCount = await countComments(dbClient, comment.objectId);
  const body = { id: comment.objectId, responseCount: commentCount };
  return comment.objectType === 'POST'
    ? await updatePostInCache({ post: body, user: author })
    : await updateProjectUpdateInCache({ update: body });
};

const removeCommentInCache = async (comment: { objectId: string; objectType: ObjectType }, author: UserSession) => {
  const commentCount = await countComments(dbClient, comment.objectId);
  const body = { id: comment.objectId, responseCount: commentCount };
  //todo check if updatePostInCache and updateProjectUpdateInCache can be merged
  return comment.objectType === 'POST'
    ? await updatePostInCache({ post: body, user: author })
    : await updateProjectUpdateInCache({ update: body });
};

//todo make sure this is called
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

// export const addLike = async (body: { author: UserSession; commentId: string }): Promise<void> => {
//   const { author, commentId } = body;

//   await addLikeToDb(dbClient, commentId, author.providerId);
// };

// export const deleteLike = async (body: { author: UserSession; commentId: string }): Promise<void> => {
//   const { author, commentId } = body;

//   await deleteLikeFromDb(dbClient, commentId, author.providerId);
// };
