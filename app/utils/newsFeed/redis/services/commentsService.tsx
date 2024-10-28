import { CommentWithResponses, NewsComment, NewsFeedEntry } from '@/common/types';
import { NewsType, RedisNewsComment, RedisNewsFeedEntry } from '../models';
import { getRedisClient, RedisClient, RedisIndex } from '../redisClient';
import { getNewsFeedEntryByKey } from '../redisService';
import { SearchOptions } from 'redis';
import { escapeRedisTextSeparators } from '../helpers';
import { getUnixTimestamp } from '@/utils/helpers';

export async function addNewsComment(newsFeedEntry: RedisNewsFeedEntry, comment: CommentWithResponses) {
  const redisClient = await getRedisClient();
  const { type, item } = newsFeedEntry;
  const hashKey = `comment:${comment.commentId}`;
  await redisClient.json.arrAppend(`${type}:${item.id}`, '$.comments', comment.commentId);

  await redisClient.hSet(hashKey, {
    id: comment.id,
    commentId: comment.commentId,
    comment: comment.comment,
    itemType: type,
    itemId: item.id,
    updatedAt: newsFeedEntry.updatedAt,
    author: JSON.stringify(comment.author),
  });
}

export async function updateNewsCommentInCache(newsType: NewsType, newsId: string, comment: RedisNewsComment) {
  const redisClient = await getRedisClient();
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
}

export async function addNewsCommentInCache(newsType: NewsType, newsId: string, comment: RedisNewsComment) {
  const redisClient = await getRedisClient();
  await updateNewsCommentInCache(newsType, newsId, comment);
  await redisClient.json.arrAppend(`${newsType}:${newsId}`, '$.comments', comment.commentId);
}

export async function removeNewsCommentInCache(newsType: NewsType, newsId: string, commentId: string) {
  const redisClient = await getRedisClient();
  const hashKey = `comment:${commentId}`;

  await redisClient.del(hashKey);

  const item = await getNewsFeedEntryByKey(redisClient, `${newsType}:${newsId}`);
  if (item && item.comments) {
    const updatedCommentsIds = item?.comments?.filter((commentId) => commentId !== commentId);
    await redisClient.json.set(`${newsType}:${newsId}`, '$.comments', updatedCommentsIds);
  }
}

export async function saveHashedComments(client: RedisClient, entry: RedisNewsFeedEntry, comments: RedisNewsComment[]) {
  for (const comment of comments) {
    await updateNewsCommentInCache(entry.type, entry.item.id, comment);

    if (comment.responses) {
      await saveHashedComments(client, entry, comment.responses);
    }
  }
}

async function getRedisComment(client: RedisClient, commentId: string) {
  const hashKey = `comment:${commentId}`;
  const commentData = await client.hGetAll(hashKey);
  return {
    id: commentData.id,
    commentId: commentData.commentId,
    comment: commentData.comment,
    updatedAt: getUnixTimestamp(new Date(commentData.updatedAt)),
  };
}

export async function getNewsFeedEntriesWithComments(client: RedisClient, entryType: NewsType, entryId: string) {
  const entry = await getNewsFeedEntryByKey(client, `${entryType}:${entryId}`);
  if (entry) {
    const commentIds = entry.comments ?? [];
    const comments = await Promise.all(
      commentIds.map(async (commentId) => {
        return await getRedisComment(client, commentId);
      }),
    );

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
      const resultItems = await searchComments(client, searchString, searchOptions);
      const result = await Promise.all(
        resultItems.map(async (itemId) => {
          const res = await getNewsFeedEntriesWithComments(client, itemType, itemId);
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
