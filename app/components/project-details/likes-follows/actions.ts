'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { addFollower, deleteProjectAndUserFollower } from '@/repository/db/follow';
import { addLike, deleteProjectAndUserLike } from '@/repository/db/like';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import { followSchema, likeSchema } from './validationSchema';

const logger = getLogger();

export const handleLike = withAuth(async (user: UserSession, body: { projectId: string }) => {
  try {
    const validatedParams = validateParams(likeSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      await addLike(dbClient, body.projectId, user.providerId);
      return { status: StatusCodes.OK };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Adding a like to a Project ${body.projectId} for user ${user.providerId}`,
      err as Error,
      body.projectId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Liking the project failed',
    };
  }
});

export const handleRemoveLike = withAuth(async (user: UserSession, body: { projectId: string }) => {
  try {
    const validatedParams = validateParams(likeSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      await deleteProjectAndUserLike(dbClient, body.projectId, user.providerId);
      return { status: StatusCodes.OK };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Removing a like for a Project ${body.projectId} for user ${user.providerId}`,
      err as Error,
      body.projectId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Unliking the project failed',
    };
  }
});

export const handleRemoveFollower = withAuth(async (user: UserSession, body: { projectId: string }) => {
  try {
    const validatedParams = validateParams(followSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      await deleteProjectAndUserFollower(dbClient, body.projectId, user.providerId);
      return { status: StatusCodes.OK };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Removing a follower for a Project ${body.projectId} for user ${user.providerId}`,
      err as Error,
      body.projectId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Unfollowing the project failed',
    };
  }
});

export const handleFollow = withAuth(async (user: UserSession, body: { projectId: string }) => {
  try {
    const validatedParams = validateParams(followSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      await addFollower(dbClient, body.projectId, user.providerId);
      return { status: StatusCodes.OK };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Adding a follower to a Project ${body.projectId} for user ${user.providerId}`,
      err as Error,
      body.projectId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Following the project failed',
    };
  }
});
