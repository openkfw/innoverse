'use server';
import { AggregateGroupByReducers, AggregateSteps, SearchOptions } from 'redis';

import { User } from '@/common/types';
import { redisError } from '@/utils/errors';
import { getUnixTimestamp } from '@/utils/helpers';
import { escapeRedisTextSeparators, filterDuplicateEntries } from '@/utils/newsFeed/redis/helpers';
import { NewsType, RedisNewsFeedEntry, RedisSync } from '@/utils/newsFeed/redis/models';
import { getRedisClient, RedisClient, RedisIndex, RedisTransactionClient } from '@/utils/newsFeed/redis/redisClient';

import { searchNewsComments } from './services/commentsService';
import { MappedRedisType, mapRedisNewsFeedEntries } from './redisMappings';

interface RedisJson {
  [key: string]: any;
}

type GetItemsOptions = {
  sortBy?: {
    updatedAt: 'ASC' | 'DESC';
  };
  filterBy?: {
    updatedAt?: {
      from: Date;
      to: Date;
    };
    projectIds?: string[];
    types?: RedisNewsFeedEntry['type'][];
    searchString?: string;
  };
  pagination?: {
    page: number;
    pageSize?: number;
  };
};

export const getLatestSuccessfulNewsFeedSync = async (client: RedisClient) => {
  const result = await client.ft.search(RedisIndex.SYNCED_AT, '@status:{OK}', {
    SORTBY: { BY: 'syncedAt', DIRECTION: 'DESC' },
    LIMIT: {
      from: 0,
      size: 1,
    },
  });
  if (result.total < 1) return undefined;
  const document = result.documents[0].value as any as RedisSync;
  return document;
};

export const getNewsFeedEntryByKey = async (client: RedisClient, key: string) => {
  try {
    return (await client.json.get(key)) as RedisNewsFeedEntry | null;
  } catch (err) {
    const error = err as Error;
    error.cause = error.message;
    const extendedError = redisError(`Failed to get RedisNewsFeedEntry with key '${key}'`, err as Error);
    throw extendedError;
  }
};

export const getNewsFeedEntries = async (client: RedisClient, options?: GetItemsOptions) => {
  const getFiltersAndIndex = () => {
    const filters: string[] = [];
    const parameters: SearchOptions['PARAMS'] = {};
    const filterBy = options?.filterBy;
    let index: RedisIndex = RedisIndex.UPDATED_AT;

    const parameterizeAndAddArray = (values: string[], parameterPrefix: string) => {
      values.forEach((value, idx) => {
        const parameterId = parameterPrefix + idx;
        parameters[parameterId] = value;
      });

      const unionSelector = Object.keys(parameters)
        .map((parameterId) => '$' + parameterId)
        .join('|');

      return { unionSelector };
    };

    // Get news feeds entries by updatedAt in date range
    if (filterBy?.updatedAt) {
      const from = getUnixTimestamp(filterBy.updatedAt.from);
      const to = getUnixTimestamp(filterBy.updatedAt.to);
      parameters['from'] = from;
      parameters['to'] = to;
      filters.push('@updatedAt:[$from, $to]');
      index = RedisIndex.UPDATED_AT;
    }

    // Get news feed entries by projectIds array
    if (filterBy?.projectIds?.length) {
      const { unionSelector: projectIdSelector } = parameterizeAndAddArray(filterBy.projectIds, 'projectId');
      filters.push(`@projectId:{${projectIdSelector}}`);
      index = RedisIndex.UPDATED_AT_TYPE_PROJECT_ID_SEARCH;
    }

    // Get news feed entries by type (Update/Event/...)
    if (filterBy?.types?.length) {
      const types: string[] = filterBy.types.map((x) => x as string);
      const { unionSelector: typeSelector } = parameterizeAndAddArray(types, 'type');
      filters.push(`@type:{${typeSelector}}`);
      index = RedisIndex.UPDATED_AT_TYPE_PROJECT_ID_SEARCH;
    }

    if (filterBy?.searchString?.length) {
      const queryParameter = 'query';
      filters.push(`@search:*$${queryParameter}*`);
      parameters[queryParameter] = escapeRedisTextSeparators(filterBy.searchString);

      index = RedisIndex.UPDATED_AT_TYPE_PROJECT_ID_SEARCH;
    }

    // Get all news feed entries
    if (!filters.length) {
      return { filters: ['@updatedAt:[0, +inf]'], index: RedisIndex.UPDATED_AT };
    }
    return { filters, index, parameters };
  };

  const getSearchCommentsOptions = (parameters: SearchOptions['PARAMS']) => {
    // change the index and remove the last query filter - @search
    const index = RedisIndex.UPDATED_AT_TYPE_PROJECT_ID_COMMENTS;
    const newFilters = [...filters.slice(0, -1)];
    // query parameter = searchString
    newFilters.push(`@comment:{*$query*}`);
    const query = newFilters.join(' ');
    return { index, query, parameters };
  };

  const getSortingOption = (): SearchOptions['SORTBY'] => {
    const sortBy = options?.sortBy?.updatedAt ?? 'DESC';
    const result = sortBy ? { BY: 'updatedAt', DIRECTION: sortBy } : undefined;
    return result;
  };

  const getPaginationOptions = (): SearchOptions['LIMIT'] => {
    const page = options?.pagination?.page ?? 1;
    const pageSize = options?.pagination?.pageSize ?? 10;
    return {
      from: (page - 1) * pageSize,
      size: pageSize,
    };
  };

  const filterBy = options?.filterBy;
  const { filters, parameters, index } = getFiltersAndIndex();
  const sortOption = getSortingOption();
  const paginationOptions = getPaginationOptions();
  let query = filters.join(' ');
  let idx = index;
  const searchOptions: SearchOptions = {
    SORTBY: sortOption,
    LIMIT: paginationOptions,
    PARAMS: parameters,
    DIALECT: 2,
  };

  try {
    const result = await client.ft.search(index, query, searchOptions);
    if (filterBy?.searchString?.length) {
      const {
        query: commentsQuery,
        index: commentsIndex,
        parameters: commentsParameters,
      } = getSearchCommentsOptions(parameters);

      query = commentsQuery;
      idx = commentsIndex;
      const commentsSearchOptions: SearchOptions = {
        ...searchOptions,
        PARAMS: commentsParameters,
      };
      const resultComments = await searchNewsComments(client, commentsIndex, query, commentsSearchOptions);
      const commentsDocuments = filterDuplicateEntries(resultComments.documents);
      const resultDocuments = filterDuplicateEntries(
        result.documents as unknown as { id: string; value: RedisNewsFeedEntry }[],
      );
      const documents = filterDuplicateEntries([...commentsDocuments, ...resultDocuments]);

      return {
        total: documents.length,
        documents,
      };
    }
    return result;
  } catch (err) {
    const error = err as Error;
    error.cause = `${error.message}; Index: ${idx}; Query: ${query}`;
    const extendedError = redisError('Failed to get items from redis', err as Error);
    throw extendedError;
  }
};

export const countNewsFeedEntriesByType = async () => {
  try {
    const client = await getRedisClient();
    const { results } = await client.ft.AGGREGATE(RedisIndex.UPDATED_AT_TYPE_PROJECT_ID_SEARCH, '*', {
      STEPS: [
        {
          type: AggregateSteps.GROUPBY,
          properties: ['@type'],
          REDUCE: [
            {
              type: AggregateGroupByReducers.COUNT,
              AS: 'count',
            },
          ],
        },
      ],
    });

    const values = results
      .map((entry) => {
        const objectWithoutNullPrototype = Object.assign({}, entry) as { type: NewsType | null; count: string };
        const count = parseInt(objectWithoutNullPrototype.count);
        return { type: objectWithoutNullPrototype.type, count };
      })
      .filter((entry): entry is { type: NewsType; count: number } => entry.type !== null)
      .map((entry) => ({ type: MappedRedisType[entry.type], count: entry.count }));

    return values;
  } catch (err) {
    const error = err as Error;
    error.cause = error.message;
    const extendedError = redisError('Failed to count redis news feed entries by type', err as Error);
    throw extendedError;
  }
};

export const countNewsFeedEntriesByProjectIds = async () => {
  try {
    const client = await getRedisClient();
    const { results } = await client.ft.AGGREGATE(RedisIndex.UPDATED_AT_TYPE_PROJECT_ID_SEARCH, '*', {
      STEPS: [
        {
          type: AggregateSteps.GROUPBY,
          properties: ['@projectId'],
          REDUCE: [
            {
              type: AggregateGroupByReducers.COUNT,
              AS: 'count',
            },
          ],
        },
      ],
    });

    const values = results
      .map((entry) => {
        const objectWithoutNullPrototype = Object.assign({}, entry) as { projectId: string | null; count: string };
        const count = parseInt(objectWithoutNullPrototype.count);
        return { projectId: objectWithoutNullPrototype.projectId, count };
      })
      .filter((entry): entry is { projectId: string; count: number } => !!entry.projectId);

    return values;
  } catch (err) {
    const error = err as Error;
    error.cause = error.message;
    const extendedError = redisError('Failed to count redis news feed entries by type', err as Error);
    throw extendedError;
  }
};

export const saveNewsFeedEntry = async (client: RedisClient, entry: RedisNewsFeedEntry) => {
  const json: RedisJson = entry;
  const key = getKeyForNewsFeedEntry(entry);
  const result = await client.json.set(key, '$', json);

  if (result !== 'OK') {
    throw redisError(`Failed to set RedisNewsFeedEntry of type '${entry.type}' with id '${entry.item.id}'`);
  }
  return entry;
};

export const saveNewsFeedSync = async (client: RedisClient, sync: RedisSync) => {
  const json: RedisJson = sync;
  const itemKey = `sync:${sync.syncedAt}`;
  const result = await client.json.set(itemKey, '$', json);

  if (result !== 'OK') {
    throw redisError(`Failed to set sync of type event with syncedAt of '${sync.syncedAt}'`);
  }
};

export const deleteItemFromRedis = async (client: RedisClient, key: string) => {
  await client.del(key);
};

export const transactionalDeleteItemsFromRedis = async (client: RedisTransactionClient, keys: string | string[]) => {
  return client.del(keys);
};

export const transactionalSaveNewsFeedEntry = async (client: RedisTransactionClient, entry: RedisNewsFeedEntry) => {
  const json: RedisJson = entry;
  const key = getKeyForNewsFeedEntry(entry);
  return client.json.set(key, '$', json);
};

export const performRedisTransaction = async (
  client: RedisClient,
  performTransaction: (client: RedisTransactionClient) => Promise<void>,
  options?: {
    keysToWatch?: string | string[];
  },
) => {
  if (options?.keysToWatch?.length) {
    await client.watch(options.keysToWatch);
  }
  const transactionClient = client.multi();
  await performTransaction(transactionClient);
  const results = await transactionClient.exec();
  return results;
};

export const getRedisNewsFeed = async (options?: GetItemsOptions) => {
  const client = await getRedisClient();
  const entries = await getNewsFeedEntries(client, options);
  const newsFeedEntries = entries.documents?.map((x) => x.value);
  // TODO: temporary solution to get rid of [Object: null prototype]
  const data = JSON.parse(JSON.stringify(newsFeedEntries, null, 2)) as RedisNewsFeedEntry[];
  return data;
};

export const getNewsFeed = async (options?: GetItemsOptions) => {
  const data = await getRedisNewsFeed(options);
  const { data: feed } = await mapRedisNewsFeedEntries(data);
  return feed ?? [];
};

const getKeyForNewsFeedEntry = (entry: RedisNewsFeedEntry) => `${entry.type}:${entry.item.id}`;

export async function batchUpdateInnoUserInCache(updatedInnoUser: User) {
  // const query = '(@authorId:{$userId}) | (@authorsId:{$userId}) | (@teamAuthorId:{$userId})';
  const query = `(@authorId:{${updatedInnoUser.id}}) | (@authorsId:{${updatedInnoUser.id}}) | (@teamAuthorId:{${updatedInnoUser.id}})`;
  const parameters: SearchOptions['PARAMS'] = {};
  parameters['userId'] = escapeRedisTextSeparators(updatedInnoUser.id as string);
  console.log('parameters', parameters);
  const searchOptions: SearchOptions = {
    PARAMS: parameters,
  };
  try {
    const redisClient = await getRedisClient();
    console.log('updating the inno user in cache', updatedInnoUser, query, searchOptions);
    // Start a transaction

    const items = await redisClient.ft.search(RedisIndex.AUTHOR, query, searchOptions);
    console.log('transation items', items);

    const transaction = redisClient.multi();
    for (const item of Object.values(items.documents)) {
      console.log('user item', item, item.id);
      // const path = `$.item.team[?(@.id==${updatedInnoUser.id})]`;
      // console.log('path', path);

      // transaction.json.set(item.id, path, updatedInnoUser);
      transaction.json.set(item.id, '.item.author', updatedInnoUser);
    }

    // Execute the transaction - one redis request
    await transaction.exec().catch((err) => {
      console.log(err);
    });
    console.log('Batch update completed');

    await redisClient.quit();
  } catch (err) {
    const error = err as Error;
    error.cause = `${error.message}; Index: ${RedisIndex.AUTHOR}; Query: ${query}`;
    const extendedError = redisError('Failed to get items from redis', err as Error);
    throw extendedError;
  }
}
