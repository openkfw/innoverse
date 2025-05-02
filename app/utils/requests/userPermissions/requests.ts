'use server';

import { RequestError } from '@/entities/error';
import { strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { cachePermissionForUser } from './queries';

import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

const logger = getLogger();

export async function hasCachePermissions(providerId: string) {
  try {
    const response = await strapiGraphQLFetcher(cachePermissionForUser, {
      providerId,
    });

    const userPermission = response.userPermission;
    if (!userPermission) throw new Error('Failed to get cache permissions for user');
    return userPermission.cachePermissions.some((u: any) => u.providerId === providerId);
  } catch (err) {
    const error = strapiError('Getting cache permissions for user', err as RequestError, providerId);
    logger.error(error);
    throw err;
  }
}
