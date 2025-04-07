'use server';

import { ObjectType, Post, User, UserSession } from '@/common/types';
import {
  getFollowedByForEntity,
  removeAllFollowsByObjectIdAndType,
  updateFollowObjectId,
} from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import {
  getReactionsForEntity,
  removeAllReactionsbyObjectIdAndType,
  updateReactionObjectId,
} from '@/repository/db/reaction';
import { InnoPlatformError, redisError } from '@/utils/errors';
import { getPromiseResults, getUnixTimestamp } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapPostToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { NewsType, RedisNewsComment, RedisPost } from '@/utils/newsFeed/redis/models';
import { getRedisClient, RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { deleteItemFromRedis, getNewsFeedEntryByKey, saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';
import { deleteCommentsInCache } from '@/utils/newsFeed/redis/services/commentsService';
import { getRedisNewsCommentsWithResponses } from '@/utils/requests/comments/requests';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import {
  createPostInStrapi,
  deletePostFromStrapi,
  getPostById,
  updatePostInStrapi,
} from '@/utils/requests/posts/requests';
import { removeAllCommentsByObjectIdAndType, updateCommentObjectId } from '@/repository/db/comment';
import { deletePostFromDb, getAllPostsFromDb } from '@/repository/db/posts';
import { sync as synchronizeNewsFeed } from '@/utils/newsFeed/newsFeedSync';

const logger = getLogger();

type AddPost = { content: string; user: UserSession; anonymous?: boolean };

type UpdatePost = { postId: string; content: string; user: UserSession };

type UpdatePostInCache = {
  post: { id: string; content?: string; likedBy?: string[]; comments?: RedisNewsComment[] };
  user: UserSession;
};

type DeletePost = { postId: string };

export const addPost = async ({ content, user, anonymous }: AddPost) => {
  const createdPost = await createPostInStrapi({
    comment: content,
    authorId: user.providerId,
    anonymous: anonymous ?? false,
  });
  if (createdPost) {
    await addPostToCache({ ...createdPost, author: user, objectType: ObjectType.POST });
    return createdPost;
  }
};

export const updatePost = async ({ postId, content, user }: UpdatePost) => {
  const updatedPost = await updatePostInStrapi(postId, content);
  if (updatedPost) {
    await updatePostInCache({ post: updatedPost, user });
    return updatedPost;
  }
};

export const deletePost = async ({ postId }: DeletePost) => {
  const deletedPost = await deletePostFromStrapi(postId);
  await Promise.all([
    deletePostFromCache(postId),
    removeAllReactionsbyObjectIdAndType(dbClient, postId, ObjectType.POST),
    removeAllCommentsByObjectIdAndType(dbClient, postId, ObjectType.POST),
    removeAllFollowsByObjectIdAndType(dbClient, postId, ObjectType.POST),
  ]);

  return deletedPost;
};

export const addPostToCache = async (post: Post) => {
  try {
    const redisClient = await getRedisClient();
    const newsFeedEntry = mapPostToRedisNewsFeedEntry(post, [], [], []);
    await saveNewsFeedEntry(redisClient, newsFeedEntry);
  } catch (err) {
    const error: InnoPlatformError = redisError(`Add post with id: ${post.id} to cache`, err as Error);
    logger.error(error);
    throw err;
  }
};

export const updatePostInCache = async ({ post, user }: UpdatePostInCache) => {
  try {
    const redisClient = await getRedisClient();
    const newsFeedEntry = await getNewsFeedEntryForPost(redisClient, { user, postId: post.id });

    if (!newsFeedEntry) return;
    const cachedItem = newsFeedEntry.item as RedisPost;
    cachedItem.content = post.content ?? cachedItem.content;
    cachedItem.likedBy = post.likedBy ?? cachedItem.likedBy;
    newsFeedEntry.item = cachedItem;
    newsFeedEntry.updatedAt = getUnixTimestamp(new Date());

    await saveNewsFeedEntry(redisClient, newsFeedEntry);
  } catch (err) {
    const error: InnoPlatformError = redisError(
      `Update post with id: ${post.id} by user ${user.providerId} could not be saved in the cache`,
      err as Error,
    );
    logger.error(error);
    throw err;
  }
};

export const deletePostFromCache = async (postId: string) => {
  try {
    const redisClient = await getRedisClient();
    const redisKey = getRedisKey(postId);
    const entry = await getNewsFeedEntryByKey(redisClient, redisKey);
    if (entry) {
      await deleteCommentsInCache(entry);
      await deleteItemFromRedis(redisClient, redisKey);
    }
  } catch (err) {
    const error: InnoPlatformError = redisError(`Delete post with id: ${postId} from cache`, err as Error);
    logger.error(error);
    throw err;
  }
};

export const getNewsFeedEntryForPost = async (
  redisClient: RedisClient,
  { user, postId }: { user: User; postId: string },
) => {
  const redisKey = getRedisKey(postId);
  const cacheEntry = await getNewsFeedEntryByKey(redisClient, redisKey);
  return cacheEntry ?? (await createNewsFeedEntryForPostById(postId, user));
};

export const createNewsFeedEntryForPostById = async (postId: string, author?: User) => {
  try {
    const post = await getPostById(postId);

    if (!post) {
      logger.warn(`Failed to create news feed cache entry for post with id ${postId}: Post not found`);
      return null;
    }

    return await createNewsFeedEntryForPost(post, author);
  } catch (err) {
    const error: InnoPlatformError = redisError(`Create news feed entry for post with id: ${postId}`, err as Error);
    logger.error(error);
    throw err;
  }
};

export const createNewsFeedEntryForPost = async (post: Post, author?: User) => {
  const comments = await getRedisNewsCommentsWithResponses(post.id, ObjectType.POST);
  const reactions = await getReactionsForEntity(dbClient, ObjectType.POST, post.id);
  const followerIds = await getFollowedByForEntity(dbClient, ObjectType.POST, post.id);
  const followers = await mapToRedisUsers(followerIds);

  const postAuthor = author || (post.author.providerId && (await getInnoUserByProviderId(post.author.providerId)));
  if (!postAuthor) {
    logger.error(`Failed to find user for post with id ${post.id}`);
    throw new Error(`Failed to find user for post`);
  }
  const postWithAuthor = { ...post, author: postAuthor, objectType: ObjectType.POST };
  return mapPostToRedisNewsFeedEntry(postWithAuthor, reactions, followers, comments);
};

const getRedisKey = (postId: string) => `${NewsType.POST}:${postId}`;

export const movePostsToSTrapi = async () => {
  const posts = await getAllPostsFromDb(dbClient);
  logger.info(`Moving ${posts.length} posts to strapi`);
  const mapPosts = posts.map(async (post) => movePostToStrapi(post));
  const result = await getPromiseResults(mapPosts);
  if (result.length) {
    logger.info(`Move completed, moved ${result.length} posts, syncronizing news feed`);

    await synchronizeNewsFeed(0, true);
  }
  return result;
};

const movePostToStrapi = async (post: {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  anonymous: boolean;
  likedBy: string[];
  content: string;
}) => {
  const oldPostId = post.id;
  const createdPost = await createPostInStrapi({
    comment: post.content,
    authorId: post.author,
    anonymous: post.anonymous,
  });

  if (!createdPost) {
    logger.error(`Failed to move post with id ${oldPostId} to Strapi`);
    return null;
  }
  await Promise.all([
    updateFollowObjectId(dbClient, oldPostId, createdPost.id, ObjectType.POST),
    updateCommentObjectId(dbClient, oldPostId, createdPost.id, ObjectType.POST),
    updateReactionObjectId(dbClient, oldPostId, createdPost.id, ObjectType.POST),
  ]);

  await deletePostFromDb(dbClient, oldPostId);
  return createdPost;
};
