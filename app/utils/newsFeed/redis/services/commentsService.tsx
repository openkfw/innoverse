import { CommentWithResponses } from '@/common/types';
import { NewsType, RedisNewsComment, RedisNewsFeedEntry } from '../models';
import { getRedisClient, RedisClient, RedisIndex } from '../redisClient';
import { getNewsFeedEntryByKey } from '../redisService';
import { SearchOptions } from 'redis';

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
  });
}

export async function getNewsComments(newsFeedEntry: RedisNewsFeedEntry) {
  const redisClient = await getRedisClient();
  const { type, item } = newsFeedEntry;
  const listKey = `${type}:${item.id}:comments`;

  const commentIds = await redisClient.lRange(listKey, 0, -1);

  const comments: RedisNewsComment[] = [];
  commentIds.map(async (commentId) => {
    const hashKey = `${type}:${item.id}:comments:${commentId}`;
    const commentData = await redisClient.hGetAll(hashKey);
    comments.push({
      id: commentData.id,
      commentId: commentData.commentId,
      comment: commentData.comment,
      upvotedBy: [],
      responseCount: 0,
      updatedAt: item.updatedAt,
    });
  });

  return comments;
}

export async function saveHashedComments(client: RedisClient, entry: RedisNewsFeedEntry, comments: RedisNewsComment[]) {
  const listKey = `${entry.type}:${entry.item.id}:comments`;

  for (const comment of comments) {
    const hashKey = `comment:${comment.commentId}`;
    await client.json.arrAppend(`${entry.type}:${entry.item.id}`, '$.comments', comment.commentId);

    await client.hSet(hashKey, {
      id: comment.id,
      commentId: comment.commentId,
      comment: comment.comment,
      itemType: entry.type,
      itemId: entry.item.id,
      updatedAt: entry.updatedAt,
    });

    if (comment.responses) {
      await saveHashedComments(client, entry, comment.responses);
    }
  }

  for (const comment of comments) {
    const hashKey = `comment:${comment.commentId}`;
    await client.json.arrAppend(`${entry.type}:${entry.item.id}`, '$.comments', comment.commentId);

    await client.hSet(hashKey, {
      id: comment.id,
      commentId: comment.commentId,
      comment: comment.comment,
      itemType: entry.type,
      itemId: entry.item.id,
      updatedAt: entry.updatedAt,
    });
  }
}

// Retrieve the item and its comments
export async function getNewsFeedEntriesWithComments(client: RedisClient, entryType: NewsType, entryId: string) {
  const item = await getNewsFeedEntryByKey(client, `${entryType}:${entryId}`);

  return item;
}

async function searchComments(client: RedisClient, searchString: string, searchOptions: SearchOptions) {
  const comments = await client.ft.search(RedisIndex.COMMENTS, `@comment:*${searchString}*`, searchOptions);
  if (comments) {
    return comments.documents.map((doc) => doc.value.itemId as string);
  }
  return [];
}

export async function searchNewsComments(client: RedisClient, searchString: string, searchOptions: SearchOptions) {
  //TODO: refactor
  const itemTypes = [NewsType.POST];
  const result = await Promise.all(
    itemTypes.map(async (itemType, id) => {
      const resultComments = await searchComments(client, searchString, searchOptions);
      const result = await Promise.all(
        resultComments.map(async (searchComment) => {
          const res = await getNewsFeedEntriesWithComments(client, itemType, searchComment);
          if (res) {
            return { id, value: res };
          }
        }),
      );
      return { documents: result.filter((res) => res !== undefined) };
    }),
  );
  return result[0];
}
