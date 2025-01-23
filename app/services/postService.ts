'use server';

import type { Post as PrismaPost } from '@prisma/client';

import { ObjectType, Post, User, UserSession } from '@/common/types';
import { getFollowedByForEntity } from '@/repository/db/follow';
import { addPostToDb, deletePostFromDb, getPostById, handlePostLikeInDb, updatePostInDb } from '@/repository/db/posts';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { InnoPlatformError, redisError } from '@/utils/errors';
import { getUnixTimestamp } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapPostToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { NewsType, RedisNewsComment, RedisPost } from '@/utils/newsFeed/redis/models';
import { getRedisClient, RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { deleteItemFromRedis, getNewsFeedEntryByKey, saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';
import { deleteCommentsInCache } from '@/utils/newsFeed/redis/services/commentsService';
import { getCommentsByObjectId } from '@/utils/requests/comments/requests';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';

const logger = getLogger();

type AddPost = { content: string; user: UserSession; anonymous?: boolean };

type UpdatePost = { postId: string; content: string; user: UserSession };

type UpdatePostInCache = {
  post: { id: string; content?: string; likedBy?: string[]; comments?: RedisNewsComment[] };
  user: UserSession;
};

type UpvotePost = { postId: string; user: UserSession };

type DeletePost = { postId: string };

export const addPost = async ({ content, user, anonymous }: AddPost) => {
  const createdPost = await addPostToDb(dbClient, content, user.providerId, anonymous ?? false);
  await addPostToCache({ ...createdPost, author: user, objectType: ObjectType.POST });
  return createdPost;
};

export const updatePost = async ({ postId, content, user }: UpdatePost) => {
  const updatedPost = await updatePostInDb(dbClient, postId, content);
  await updatePostInCache({ post: updatedPost, user });
  return updatedPost;
};

export const deletePost = async ({ postId }: DeletePost) => {
  const deletedPost = await deletePostFromDb(dbClient, postId);
  await deletePostFromCache(postId);
  return deletedPost;
};

export const handleUpvotePost = async ({ postId, user }: UpvotePost) => {
  const updatedPost = await handlePostLikeInDb(dbClient, postId, user.providerId);
  if (updatedPost) {
    await updatePostInCache({ post: updatedPost, user });
  }
  return updatedPost;
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
    const post = await getPostById(dbClient, postId);

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

export const createNewsFeedEntryForPost = async (post: PrismaPost, author?: User) => {
  const comments = await getCommentsByObjectId({ objectId: post.id });
  const reactions = await getReactionsForEntity(dbClient, ObjectType.POST, post.id);
  const followerIds = await getFollowedByForEntity(dbClient, ObjectType.POST, post.id);
  const followers = await mapToRedisUsers(followerIds);

  const postAuthor = author ?? (await getInnoUserByProviderId(post.author));
  const postWithAuthor = { ...post, author: postAuthor, objectType: ObjectType.POST };
  return mapPostToRedisNewsFeedEntry(postWithAuthor, reactions, followers, comments.data);
};

const getRedisKey = (postId: string) => `${NewsType.POST}:${postId}`;
