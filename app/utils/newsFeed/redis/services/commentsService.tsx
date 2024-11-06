import { NewsType, RedisNewsComment, RedisNewsFeedEntry } from '../models';
import { getRedisClient, RedisClient, RedisIndex } from '../redisClient';
import { getNewsFeedEntryByKey } from '../redisService';
import { SearchOptions } from 'redis';
import { escapeRedisTextSeparators } from '../helpers';
import { getUnixTimestamp } from '@/utils/helpers';
import { InnoPlatformError, redisError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getRedisNewsCommentsWithResponses } from '@/utils/requests/comments/requests';

const logger = getLogger();

export async function setCommentsIdsToEntry(redisClient: RedisClient, redisKey: string, commentsIds: string[]) {
  await redisClient.json.set(redisKey, '.item.comments', commentsIds);
  await redisClient.json.set(redisKey, '.item.updatedAt', getUnixTimestamp(new Date()));
  await redisClient.json.set(redisKey, '.item.createdAt', getUnixTimestamp(new Date()));
}

export async function updateNewsCommentInCache(comment: RedisNewsComment) {
  const redisClient = await getRedisClient();
  const hashKey = `comment:${comment.commentId}`;

  await redisClient.hSet(hashKey, {
    id: comment.id,
    commentId: comment.commentId,
    comment: comment.comment,
    updatedAt: getUnixTimestamp(new Date()),
    authorId: JSON.stringify(comment.author),
  });
}

async function addNewsCommentToRedisCache(
  redisClient: RedisClient,
  newsType: NewsType,
  newsId: string,
  comment: RedisNewsComment,
) {
  try {
    const hashKey = `comment:${comment.commentId}`;

    await redisClient.hSet(hashKey, {
      id: comment.id,
      commentId: comment.commentId,
      comment: comment.comment,
      itemType: newsType,
      itemId: newsId,
      updatedAt: getUnixTimestamp(new Date()),
      author: JSON.stringify(comment.author),
    });
  } catch (err) {
    const error: InnoPlatformError = redisError(`Saving post comments for entry with id: ${newsId}`, err as Error);
    logger.error(error);
    throw err;
  }
}

export async function addNewsCommentToCache(newsType: NewsType, newsId: string, comment: RedisNewsComment) {
  const redisClient = await getRedisClient();
  await addNewsCommentToRedisCache(redisClient, newsType, newsId, comment);
  await redisClient.json.arrAppend(`${newsType}:${newsId}`, '.item.comments', comment.commentId);
  await redisClient.json.set(`${newsType}:${newsId}`, '.item.updatedAt', comment.updatedAt);
}

export async function removeNewsCommentInCache(newsType: NewsType, newsId: string, commentId: string) {
  const redisClient = await getRedisClient();
  const hashKey = `comment:${commentId}`;

  await redisClient.del(hashKey);

  const item = await getNewsFeedEntryByKey(redisClient, `${newsType}:${newsId}`);
  if (item && item.comments) {
    const updatedCommentsIds = item?.comments?.filter((commentId) => commentId !== commentId);
    await setCommentsIdsToEntry(redisClient, `${newsType}:${newsId}`, updatedCommentsIds);
  }
}

export async function saveComments(redisClient: RedisClient, entry: RedisNewsFeedEntry, comments: RedisNewsComment[]) {
  await saveHashedComments(redisClient, entry, comments);
  let queue = comments;
  let commentsIds: string[] = [];
  while (queue.length) {
    queue.forEach((comment) => {
      commentsIds.push(comment.commentId);
    });
    queue = queue.flatMap((comment) => comment.comments) as RedisNewsComment[];
  }
  const redisKey = `${entry.type}:${entry.item.id}`;
  await setCommentsIdsToEntry(redisClient, redisKey, commentsIds);
}

export async function saveHashedComments(
  redisClient: RedisClient,
  entry: RedisNewsFeedEntry,
  comments: RedisNewsComment[],
) {
  try {
    for (const comment of comments) {
      await addNewsCommentToRedisCache(redisClient, entry.type, entry.item.id, comment);
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

export async function getNewsFeedEntryWithComments(client: RedisClient, entryType: NewsType, entryId: string) {
  const entry = await getNewsFeedEntryByKey(client, `${entryType}:${entryId}`);
  if (entry) {
    // TODO: return the comments from Redis Cache instead of the DB
    const comments = await getRedisNewsCommentsWithResponses(entry.item.id, entry.type);
    return { ...entry, item: { ...entry.item, comments } } as RedisNewsFeedEntry;
  }
}

async function searchComments(client: RedisClient, searchString: string, searchOptions: SearchOptions) {
  const query = escapeRedisTextSeparators(searchString);
  const comments = await client.ft.search(RedisIndex.COMMENTS, `@comment:*${query}*`, searchOptions);
  if (comments) {
    return comments.documents.map((doc) => doc.value.itemId as string);
  }
  return [];
}

export async function searchNewsComments(client: RedisClient, searchString: string, searchOptions: SearchOptions) {
  const itemTypes = [NewsType.POST, NewsType.UPDATE];
  const result = await Promise.all(
    itemTypes.map(async (itemType, id) => {
      const resultComments = await searchComments(client, searchString, searchOptions);
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
