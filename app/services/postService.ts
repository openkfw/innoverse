'use server';

import { ObjectType, Post, User } from '@/common/types';
import { removeAllCommentsByObjectIdAndType } from '@/repository/db/comment';
import { getFollowedByForEntity, removeAllFollowsByObjectIdAndType } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity, removeAllReactionsbyObjectIdAndType } from '@/repository/db/reaction';
import { InnoPlatformError, redisError } from '@/utils/errors';
import { getUnixTimestamp } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapPostToRedisNewsFeedEntry, mapToRedisUsers } from '@/utils/newsFeed/redis/mappings';
import { NewsType, RedisNewsComment, RedisPost } from '@/utils/newsFeed/redis/models';
import { getRedisClient, RedisClient } from '@/utils/newsFeed/redis/redisClient';
import { deleteItemFromRedis, getNewsFeedEntryByKey, saveNewsFeedEntry } from '@/utils/newsFeed/redis/redisService';
import { deleteCommentsInCache } from '@/utils/newsFeed/redis/services/commentsService';
import { getCommentsByObjectIdWithResponses } from '@/utils/requests/comments/requests';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import {
  createPostInStrapi,
  deletePostFromStrapi,
  getPostById,
  updatePostInStrapi,
} from '@/utils/requests/posts/requests';

const logger = getLogger();

type CreatePost = {
  comment: string;
  authorId: string;
  anonymous?: boolean;
};

type UpdatePost = { postId: string; comment: string; user: User };

type UpdatePostInCache = {
  post: { id: string; comment?: string; likedBy?: string[]; comments?: RedisNewsComment[] };
  user: User;
};

type DeletePost = { postId: string };

export const createPost = async (post: CreatePost) => {
  const createdPost = await createPostInStrapi(post);
  if (createdPost) {
    await addPostToCache(createdPost);
    return createdPost;
  }
};

export const updatePost = async ({ postId, comment, user }: UpdatePost) => {
  const updatedPost = await updatePostInStrapi(postId, comment);
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
    cachedItem.comment = post.comment ?? cachedItem.comment;
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
  const { comments } = await getCommentsByObjectIdWithResponses(post.id, ObjectType.POST);
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
