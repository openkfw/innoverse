import { createClient, RediSearchSchema, SchemaFieldTypes } from 'redis';

import { serverConfig } from '@/config/server';
import getLogger from '@/utils/logger';

export type RedisClient = ReturnType<typeof createClient>;
export type RedisTransactionClient = ReturnType<RedisClient['multi']>;

let client: RedisClient | undefined = undefined;

const logger = getLogger();

export enum RedisIndex {
  UPDATED_AT_TYPE_PROJECT_ID_SEARCH = 'idx:updatedAt:type:projectId:search',
  UPDATED_AT = 'idx:updatedAt',
  SYNCED_AT = 'idx:syncedAt:status',
}

export const getRedisClient = async () => {
  if (!client) {
    client = await createRedisClient();
    await createIndices(client);
    return client;
  }

  if (!client.isOpen || !client.isReady) {
    client = await client.connect();
  }

  return client;
};

const createRedisClient = async () => {
  return await createClient({
    url: serverConfig.REDIS_URL,
    socket: {
      // Redis server's default keep-alive (config key 'tcp-keepalive') is 300 seconds
      keepAlive: 60 * 1000,
      reconnectStrategy: (retries, cause) => {
        if (retries > 3) {
          logger.error(`Failed to connect to redis after a total of ${retries} attempts:`, cause);
          return false;
        }

        const retryDelayInMs = 500 * Math.pow(2, retries);
        logger.warn(`Reconnecting to redis in ${retryDelayInMs} ms (retry: ${retries + 1})`);
        return retryDelayInMs;
      },
    },
  })
    .on('error', (error: Error) => {
      if (client && !client.isReady) {
        // Connection errors will trigger the reconnect strategy
        logger.warn(`Redis client connection error: ${error.message}`);
        return;
      }
      logger.error('Redis client error:', error);
    })
    .connect();
};

const createIndices = async (client: RedisClient) => {
  await createIndexOrCatch({
    client,
    index: RedisIndex.SYNCED_AT,
    schema: {
      '$.syncedAt': {
        type: SchemaFieldTypes.NUMERIC,
        AS: 'syncedAt',
        SORTABLE: true,
      },
      '$.status': {
        type: SchemaFieldTypes.TAG,
        AS: 'status',
      },
    },
  });

  await createIndexOrCatch({
    client,
    index: RedisIndex.UPDATED_AT_TYPE_PROJECT_ID_SEARCH,
    schema: {
      '$.updatedAt': {
        type: SchemaFieldTypes.NUMERIC,
        AS: 'updatedAt',
        SORTABLE: true,
      },
      '$.type': {
        type: SchemaFieldTypes.TAG,
        AS: 'type',
      },
      '$.item.projectId': {
        type: SchemaFieldTypes.TAG,
        AS: 'projectId',
      },
      '$.search': {
        type: SchemaFieldTypes.TEXT,
        AS: 'search',
      },
    },
  });

  await createIndexOrCatch({
    client,
    index: RedisIndex.UPDATED_AT,
    schema: {
      '$.updatedAt': {
        type: SchemaFieldTypes.NUMERIC,
        AS: 'updatedAt',
        SORTABLE: true,
      },
    },
  });
};

const createIndexOrCatch = async ({
  client,
  index,
  schema,
}: {
  client: RedisClient;
  index: string;
  schema: RediSearchSchema;
}) => {
  try {
    logger.debug(`Trying to create redis index '${index}' ...`);
    await client.ft.create(index, schema, { ON: 'JSON' });
    logger.info(`Created redis index '${index}'`);
  } catch (e: unknown) {
    const error = e as Error;

    if (error?.message === 'Index already exists') {
      logger.debug(`Redis index '${index}' already exists, skipped creation`);
    } else {
      logger.error(e);
    }
  }
};
