'use server';

import { AggregateGroupByReducers, AggregateSteps, SearchOptions } from 'redis';

import { redisError } from '@/utils/errors';
import { getUnixTimestamp } from '@/utils/helpers';
import { NewsType, RedisNewsFeedEntry, RedisSync } from '@/utils/newsFeed/redis/models';
import { getRedisClient, RedisClient, RedisIndex, RedisTransactionClient } from '@/utils/newsFeed/redis/redisClient';

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
  return (await client.json.get(key)) as RedisNewsFeedEntry | null;
};

export const getNewsFeedEntries = async (client: RedisClient, options?: GetItemsOptions) => {
  const escapeString = (str: string) => str.replace('-', '\\-');
  const getFiltersAndIndex = () => {
    const filters: string[] = [];
    const filterBy = options?.filterBy;

    let index: RedisIndex = RedisIndex.UPDATED_AT;

    // Get news feeds entries by updatedAt in date range
    if (filterBy?.updatedAt) {
      const from = getUnixTimestamp(filterBy.updatedAt.from);
      const to = getUnixTimestamp(filterBy.updatedAt.to);
      filters.push(`@updatedAt:[${from}, ${to}]`);
      index = RedisIndex.UPDATED_AT;
    }
    // Get news feed entries by projectIds array
    if (filterBy?.projectIds?.length) {
      const projectIds = filterBy.projectIds.join('|');
      filters.push(`@projectId:{${projectIds}}`);
      index = RedisIndex.UPDATED_AT_TYPE_PROJECT_ID;
    }
    // Get news feed entries by type (Update/Event/...)
    if (filterBy?.types?.length) {
      const types = filterBy.types.map(escapeString).join('|');
      filters.push(`@type:{${types}}`);
      index = RedisIndex.UPDATED_AT_TYPE_PROJECT_ID;
    }
    if (!filters.length) {
      // Get all news feed entries
      return { filters: ['@updatedAt:[0, +inf]'], index: RedisIndex.UPDATED_AT };
    }
    return { filters, index };
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

  const { filters, index } = getFiltersAndIndex();
  const sortOption = getSortingOption();
  const paginationOptions = getPaginationOptions();
  const query = filters.join(' ');

  try {
    const result = await client.ft.search(index, query, {
      SORTBY: sortOption,
      LIMIT: paginationOptions,
    });
    return result;
  } catch (err) {
    const error = err as Error;
    error.cause = `${error.message}; Index: ${index}; Query: ${query}`;
    const extendedError = redisError('Failed to get items from redis', err as Error);
    throw extendedError;
  }
};

export const countNewsFeedEntriesByType = async () => {
  try {
    const client = await getRedisClient();
    const { results } = await client.ft.AGGREGATE(RedisIndex.UPDATED_AT_TYPE_PROJECT_ID, '*', {
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
    const { results } = await client.ft.AGGREGATE(RedisIndex.UPDATED_AT_TYPE_PROJECT_ID, '*', {
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
      .filter((entry): entry is { projectId: string; count: number } => entry.projectId !== null);

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

export const getNewsFeed = async (options?: GetItemsOptions) => {
  const client = await getRedisClient();
  const entries = await getNewsFeedEntries(client, options);
  const newsFeedEntries = entries.documents.map((x) => x.value);
  // TODO: temporary solution to get rid of [Object: null prototype]
  const data = JSON.parse(JSON.stringify(newsFeedEntries, null, 2)) as RedisNewsFeedEntry[];
  return await mapRedisNewsFeedEntries(data);
};

const getKeyForNewsFeedEntry = (entry: RedisNewsFeedEntry) => `${entry.type}:${entry.item.id}`;
