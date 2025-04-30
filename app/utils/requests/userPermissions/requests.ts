'use server';

import { RequestError } from '@/entities/error';
import { strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { cacheUpdatePermissionForUser } from './queries';

import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

const logger = getLogger();

export async function hasCacheUpdatePermissions(providerId: string) {
  try {
    const response = await strapiGraphQLFetcher(cacheUpdatePermissionForUser, {
      providerId,
    });

    const userPermission = response.userPermission;
    if (!userPermission) throw new Error('Failed to get cache update permissions for user');
    return userPermission.cacheUpdatePermissions.some((u: any) => u.providerId === providerId);
  } catch (err) {
    const error = strapiError('Getting cache update permissions for user', err as RequestError, providerId);
    logger.error(error);
    throw err;
  }
}
