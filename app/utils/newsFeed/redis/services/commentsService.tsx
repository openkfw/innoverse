import { SearchOptions } from 'redis';

import { InnoPlatformError, redisError } from '@/utils/errors';
import { getPromiseResults, getUnixTimestamp } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { getRedisNewsCommentsWithResponses } from '@/utils/requests/comments/requests';

import { NewsType, RedisNewsComment, RedisNewsFeedEntry } from '../models';
import { getRedisClient, RedisClient, RedisIndex } from '../redisClient';
import { getNewsFeedEntryByKey } from '../redisService';

const logger = getLogger();

export type AddNewsComment = {
  newsType: NewsType;
  newsId: string;
  comment: RedisNewsComment;
  parentId?: string;
  projectId?: string;
};

export async function setCommentsIdsToEntry(redisClient: RedisClient, redisKey: string, commentsIds: string[]) {
  await redisClient.json.set(redisKey, '.item.comments', commentsIds);
  await redisClient.json.set(redisKey, '.item.updatedAt', getUnixTimestamp(new Date()));
  await redisClient.json.set(redisKey, '.item.createdAt', getUnixTimestamp(new Date()));
}

export async function updateNewsCommentInCache(comment: RedisNewsComment) {
  const redisClient = await getRedisClient();
  const hashKey = `comment:${comment.id}`;

  await redisClient.hSet(hashKey, {
    id: comment.id,
    comment: comment.text,
    updatedAt: getUnixTimestamp(new Date()),
    authorId: JSON.stringify(comment.author),
  });
}

async function addNewsCommentToRedisCache(redisClient: RedisClient, body: AddNewsComment) {
  try {
    const hashKey = `comment:${body.comment.id}`;
    const { newsType, newsId, comment } = body;
    await redisClient.hSet(hashKey, {
      id: body.comment.id,
      ...(body.parentId && { parentId: body.parentId }),
      ...(body.projectId && { projectId: body.projectId }),
      comment: comment.text,
      itemType: newsType,
      itemId: newsId,
      updatedAt: getUnixTimestamp(new Date()),
      author: JSON.stringify(comment.author),
    });
    if (body.parentId) {
      const parentIndexKey = `parentId:${body.parentId}`;
      await redisClient.sAdd(parentIndexKey, hashKey);
    }
  } catch (err) {
    const error: InnoPlatformError = redisError(`Saving post comments for entry with id: ${body.newsId}`, err as Error);
    logger.error(error);
    throw err;
  }
}

export async function addNewsCommentToCache(body: AddNewsComment) {
  const redisClient = await getRedisClient();
  const { newsType, newsId, comment } = body;
  await addNewsCommentToRedisCache(redisClient, body);
  await redisClient.json.arrAppend(`${newsType}:${newsId}`, '.item.comments', comment.id);
  await redisClient.json.set(`${newsType}:${newsId}`, '.item.updatedAt', comment.updatedAt);
}

export async function deleteNewsCommentInCache(newsType: NewsType, newsId: string, commentId: string) {
  const redisClient = await getRedisClient();
  // remove all the replies for the comment
  const replies = await getCommentsByParentId(redisClient, commentId);
  getPromiseResults(replies.map(async (reply) => await deleteComment(redisClient, reply.id)));
  const replyIds = replies.map((reply) => reply.id);
  await deleteComment(redisClient, commentId);
  await deleteCommentsIdsFromEntry(redisClient, newsType, newsId, [commentId, ...replyIds]);
}

async function deleteCommentsIdsFromEntry(
  redisClient: RedisClient,
  newsType: string,
  newsId: string,
  idsToDelete: string[],
) {
  const entry = await getNewsFeedEntryByKey(redisClient, `${newsType}:${newsId}`);
  if (entry && entry.item.comments) {
    const updatedCommentsIds = entry.item.comments.filter((commentId) => !idsToDelete.includes(commentId));
    await setCommentsIdsToEntry(redisClient, `${newsType}:${newsId}`, updatedCommentsIds);
  }
}

async function deleteComment(redisClient: RedisClient, commentId: string) {
  const hashKey = `comment:${commentId}`;
  await redisClient.del(hashKey);
}

export const deleteCommentsInCache = async (entry: RedisNewsFeedEntry) => {
  const redisClient = await getRedisClient();
  const commentsIds = entry.item.comments;
  if (commentsIds) {
    commentsIds.map(async (commentId) => await deleteComment(redisClient, commentId));
  }
};

export async function saveComments(redisClient: RedisClient, entry: RedisNewsFeedEntry, comments: RedisNewsComment[]) {
  await saveHashedComments(redisClient, entry, comments);
  let queue = comments;
  const commentsIds: string[] = [];
  while (queue.length) {
    queue.forEach((comment) => {
      commentsIds.push(comment.id);
    });
    queue = queue.flatMap((comment) => comment.comments) as RedisNewsComment[];
  }
  const redisKey = `${entry.type}:${entry.item.id}`;
  await setCommentsIdsToEntry(redisClient, redisKey, commentsIds);
  return commentsIds;
}

export async function saveHashedComments(
  redisClient: RedisClient,
  entry: RedisNewsFeedEntry,
  comments: RedisNewsComment[],
) {
  try {
    for (const comment of comments) {
      await addNewsCommentToRedisCache(redisClient, {
        newsType: entry.type,
        newsId: entry.item.id,
        comment,
        parentId: comment.parentId,
        projectId: entry.item.projectId,
      });
      if (comment.comments) {
        await saveHashedComments(redisClient, entry, comment.comments);
      }
    }
  } catch (err) {
    const error: InnoPlatformError = redisError(
      `Saving comments to cache for entry with id: ${entry.item.id}`,
      err as Error,
    );
    logger.error(error);
    throw err;
  }
}

export async function getRedisComment(client: RedisClient, commentId: string) {
  const hashKey = `comment:${commentId}`;
  const commentData = await client.hGetAll(hashKey);
  return {
    id: commentData.id,
    commentId: commentData.commentId,
    comment: commentData.comment,
    updatedAt: getUnixTimestamp(new Date(commentData.updatedAt)),
    author: commentData.author && JSON.parse(commentData.author),
  };
}

const getCommentsByParentId = async (client: RedisClient, parentId: string) => {
  const parentIndexKey = `parentId:${parentId}`;
  const hashKeys = await client.sMembers(parentIndexKey);

  const items = await Promise.all(
    hashKeys.map(async (hashKey) => {
      const item = await client.hGetAll(hashKey);
      return item;
    }),
  );

  return items;
};

export async function getNewsFeedEntryWithComments(client: RedisClient, entryType: NewsType, entryId: string) {
  const entry = await getNewsFeedEntryByKey(client, `${entryType}:${entryId}`);
  if (entry) {
    // TODO: return the comments from Redis Cache instead of the DB
    const comments = await getRedisNewsCommentsWithResponses(entry.item.id);
    return { ...entry, item: { ...entry.item, comments } } as RedisNewsFeedEntry;
  }
}

async function searchComments(client: RedisClient, index: RedisIndex, query: string, searchOptions: SearchOptions) {
  const comments = await client.ft.search(index, query, searchOptions);
  if (comments) {
    return comments.documents.map((doc) => doc.value.itemId as string);
  }
  return [];
}

export async function searchNewsComments(
  client: RedisClient,
  index: RedisIndex,
  query: string,
  searchOptions: SearchOptions,
) {
  const itemTypes = [NewsType.POST, NewsType.UPDATE];
  const result = await Promise.all(
    itemTypes.map(async (itemType, id) => {
      const resultComments = await searchComments(client, index, query, searchOptions);
      const result = await Promise.all(
        resultComments.map(async (itemId) => {
          const res = await getNewsFeedEntryWithComments(client, itemType, itemId);
          if (res) {
            return { id: `${id}`, value: res };
          }
        }),
      );

      return { documents: result.filter((res) => res !== undefined) };
    }),
  );
  return mergeDocumentsArray(result.flat());
}

interface DocumentsArray {
  documents: { id: string; value: RedisNewsFeedEntry }[];
}

function mergeDocumentsArray(arr: DocumentsArray[]): { documents: { id: string; value: RedisNewsFeedEntry }[] } {
  const mergedDocuments = arr.reduce(
    (acc, current) => {
      return acc.concat(current.documents);
    },
    [] as { id: string; value: RedisNewsFeedEntry }[],
  );
  return { documents: mergedDocuments };
}
