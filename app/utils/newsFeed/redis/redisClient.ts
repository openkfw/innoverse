import { createClient, RediSearchSchema, SchemaFieldTypes } from 'redis';

import { serverConfig } from '@/config/server';
import getLogger from '@/utils/logger';

export type RedisClient = ReturnType<typeof createClient>;
export type RedisTransactionClient = ReturnType<RedisClient['multi']>;

let client: RedisClient | undefined = undefined;

const logger = getLogger();

export enum RedisIndex {
  UPDATED_AT_TYPE_PROJECT_ID = 'idx:updatedAt:type:projectId',
  UPDATED_AT = 'idx:updatedAt',
  SYNCED_AT = 'idx:syncedAt:status',
}

export const getRedisClient = async () => {
  if (!client) {
    const _client = await createClient({ url: serverConfig.REDIS_URL })
      .on('error', (error) => logger.error('Redis Client Error', error))
      .connect();
    client = _client;
    await createIndices(client);
  }
  return client;
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
    index: RedisIndex.UPDATED_AT_TYPE_PROJECT_ID,
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
