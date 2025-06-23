import { AggregateGroupByReducers, AggregateSteps, SearchOptions } from 'redis';

import { ObjectType } from '@/common/types';
import { redisError } from '@/utils/errors';
import { getPromiseResults, getUnixTimestamp } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { getCommentsByObjectIdWithResponses } from '@/utils/requests/comments/requests';

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
  try {
    await redisClient.json.set(redisKey, '.item.comments', commentsIds);
    await redisClient.json.set(redisKey, '.item.updatedAt', getUnixTimestamp(new Date()));
    await redisClient.json.set(redisKey, '.item.createdAt', getUnixTimestamp(new Date()));
  } catch (err) {
    const error = redisError(`Setting comments ids to entry with key: ${redisKey}`, err as Error);
    logger.error(error);
    throw err;
  }
}

export async function updateNewsCommentInCache(comment: RedisNewsComment) {
  try {
    const redisClient = await getRedisClient();
    const hashKey = `comment:${comment.id}`;

    await redisClient.hSet(hashKey, {
      id: comment.id,
      comment: comment.text,
      updatedAt: getUnixTimestamp(new Date()),
      authorId: JSON.stringify(comment.author),
    });
  } catch (err) {
    const error = redisError(`Updating comment with id: ${comment.id}`, err as Error);
    logger.error(error);
    throw err;
  }
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
    const error = redisError(`Saving post comments for entry with id: ${body.newsId}`, err as Error);
    logger.error(error);
    throw err;
  }
}

export async function addNewsCommentToCache(body: AddNewsComment) {
  const redisClient = await getRedisClient();
  const { newsType, newsId, comment } = body;
  await addNewsCommentToRedisCache(redisClient, body);
  const key = `${newsType}:${newsId}`;
  const commentsPath = '.item.comments';
  try {
    await redisClient.json.get(key, { path: commentsPath });
  } catch (err) {
    await redisClient.json.set(key, commentsPath, []);
  }
  await redisClient.json.arrAppend(key, commentsPath, comment.id);
  await redisClient.json.set(key, '.item.updatedAt', comment.updatedAt);
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
  try {
    const hashKey = `comment:${commentId}`;
    await redisClient.del(hashKey);
  } catch (err) {
    const error = redisError(`Deleting comment with id: ${commentId}`, err as Error);
    logger.error(error);
    throw err;
  }
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
    const error = redisError(`Saving comments to cache for entry with id: ${entry.item.id}`, err as Error);
    logger.error(error);
    throw err;
  }
}

export async function getRedisComment(client: RedisClient, commentId: string) {
  try {
    const hashKey = `comment:${commentId}`;
    const commentData = await client.hGetAll(hashKey);
    return {
      id: commentData.id,
      commentId: commentData.commentId,
      comment: commentData.comment,
      updatedAt: getUnixTimestamp(new Date(commentData.updatedAt)),
      author: commentData.author && JSON.parse(commentData.author),
    };
  } catch (err) {
    const error = redisError(`Getting comment with id: ${commentId}`, err as Error);
    logger.error(error);
    throw err;
  }
}

const getCommentsByParentId = async (client: RedisClient, parentId: string) => {
  try {
    const parentIndexKey = `parentId:${parentId}`;
    const hashKeys = await client.sMembers(parentIndexKey);

    const items = await Promise.all(
      hashKeys.map(async (hashKey) => {
        const item = await client.hGetAll(hashKey);
        return item;
      }),
    );

    return items;
  } catch (err) {
    const error = redisError(`Getting comments by parent id: ${parentId}`, err as Error);
    logger.error(error);
    throw err;
  }
};

export async function getNewsFeedEntryWithComments(
  client: RedisClient,
  itemType: { newsType: NewsType; objectType: ObjectType },
  entryId: string,
) {
  const entry = await getNewsFeedEntryByKey(client, `${itemType.newsType}:${entryId}`);
  if (entry) {
    // TODO: return the comments from Redis Cache instead of the DB
    const { comments } = await getCommentsByObjectIdWithResponses(entry.item.id, itemType.objectType);
    return { ...entry, item: { ...entry.item, comments } } as RedisNewsFeedEntry;
  }
}

async function searchComments(client: RedisClient, index: RedisIndex, query: string, searchOptions: SearchOptions) {
  try {
    const countResults = await client.ft.aggregate(index, query, {
      STEPS: [
        {
          type: AggregateSteps.GROUPBY,
          properties: ['@itemId'],
          REDUCE: [
            {
              type: AggregateGroupByReducers.FIRST_VALUE,
              property: '@comment',
              AS: 'firstComment',
            },
          ],
        },
      ],
      PARAMS: searchOptions.PARAMS,
      DIALECT: 2,
    });

    const sortBy = searchOptions.SORTBY;
    const totalGroups = countResults.total;
    const offset = searchOptions.LIMIT?.from as number;
    let adjustedLimit = searchOptions.LIMIT ?? { from: 0, size: 0 };
    if (totalGroups <= offset) {
      adjustedLimit = { from: 0, size: 0 };
    }

    // The "SORTBY" is not allowed as a STEP, but the aggregation does not work without this step
    // Typescript marks this as a warning, so the workaround is to cast the type to "any"
    const options: any = {
      STEPS: [
        {
          type: AggregateSteps.SORTBY,
          BY: '@updatedAt',
          DIRECTION: sortBy,
        },
        {
          type: AggregateSteps.GROUPBY,
          properties: ['@itemId'],
          REDUCE: [
            {
              type: AggregateGroupByReducers.FIRST_VALUE,
              property: '@comment',
              AS: 'comment',
            },
            {
              type: AggregateGroupByReducers.FIRST_VALUE,
              property: '@type',
              AS: 'itemType',
            },
          ],
        },
        {
          type: AggregateSteps.LIMIT,
          from: adjustedLimit.from,
          size: adjustedLimit.size,
        },
      ],
      PARAMS: searchOptions.PARAMS,
      DIALECT: 2,
    };
    const comments = await client.ft.aggregate(index, query, options);

    if (comments) {
      return comments.results.map((result) => {
        return {
          itemId: result['itemId'],
          type: result['itemType'],
        } as { itemId: string; type: string };
      });
    }
    return [];
  } catch (err) {
    const error = redisError(`Searching comments with query: ${query}`, err as Error);
    logger.error(error);
    throw err;
  }
}

export async function searchNewsComments(
  client: RedisClient,
  index: RedisIndex,
  query: string,
  searchOptions: SearchOptions,
) {
  const itemTypes = [
    { newsType: NewsType.POST, objectType: ObjectType.POST },
    { newsType: NewsType.UPDATE, objectType: ObjectType.UPDATE },
    { newsType: NewsType.EVENT, objectType: ObjectType.EVENT },
    { newsType: NewsType.PROJECT, objectType: ObjectType.PROJECT },
    { newsType: NewsType.COLLABORATION_QUESTION, objectType: ObjectType.COLLABORATION_QUESTION },
    { newsType: NewsType.SURVEY_QUESTION, objectType: ObjectType.SURVEY_QUESTION },
  ];
  const result = await Promise.all(
    itemTypes.map(async (itemType) => {
      const resultComments = await searchComments(client, index, query, searchOptions);
      const result = await Promise.all(
        resultComments.map(async (item) => {
          const res = await getNewsFeedEntryWithComments(client, itemType, item.itemId);
          if (res) {
            return { id: `${item.type}:${item.itemId}`, value: res };
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
