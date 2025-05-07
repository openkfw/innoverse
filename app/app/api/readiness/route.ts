import { StatusCodes } from 'http-status-codes';

import { clientConfig } from '@/config/client';
import getLogger from '@/utils/logger';
import { getRedisClient } from '@/utils/newsFeed/redis/redisClient';

const logger = getLogger();

export async function GET() {
  const [strapiReady, redisReady] = await Promise.all([checkIfStrapiIsReady(), checkIfRedisIsReady()]);
  const ready = strapiReady && redisReady;
  const statusCode = ready ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR;

  return Response.json(
    {
      ready: readyToString(ready),
      services: {
        redis: readyToString(redisReady),
        strapi: readyToString(strapiReady),
      },
    },
    {
      status: statusCode,
    },
  );
}

const readyToString = (ready: boolean) => (ready ? 'ready' : 'not ready');

async function checkIfStrapiIsReady() {
  try {
    const healthEndpoint = `${clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}/health`;
    const response = await fetch(healthEndpoint);
    if (!response.ok) return false;

    const responseBody = (await response.json()) as { status?: string };
    const ready = responseBody.status?.toLowerCase() === 'ready';
    return ready;
  } catch (exception) {
    logger.warn('Strapi readiness healthcheck failed:', exception);
    return false;
  }
}

async function checkIfRedisIsReady() {
  try {
    const redisClient = await getRedisClient();
    return redisClient.isReady;
  } catch (exception) {
    logger.warn('Redis readiness healthcheck failed:', exception);
    return false;
  }
}
