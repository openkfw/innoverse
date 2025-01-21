'use server';

import { StatusCodes } from 'http-status-codes';

import { ObjectType, UserSession } from '@/common/types';
import { addLike, deleteObjectAndUserLike } from '@/repository/db/like';
import { addFollow, removeFollow } from '@/services/followService';
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
      await addLike(dbClient, body.projectId, ObjectType.PROJECT, user.providerId);
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
      await deleteObjectAndUserLike(dbClient, body.projectId, user.providerId);
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

export const handleRemoveFollower = withAuth(
  async (user: UserSession, body: { objectId: string; objectType: ObjectType }) => {
    try {
      const validatedParams = validateParams(followSchema, body);
      if (validatedParams.status === StatusCodes.OK) {
        const follow = await removeFollow({
          user,
          object: { objectId: body.objectId, objectType: body.objectType, followedBy: user.providerId },
        });
        return { status: StatusCodes.OK, data: follow };
      }
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Removing a follower for a ${body.objectType} ${body.objectId} for user ${user.providerId}`,
        err as Error,
        body.objectId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: `Unfollowing the ${body.objectType} failed`,
      };
    }
  },
);

export const handleFollow = withAuth(async (user: UserSession, body: { objectId: string; objectType: ObjectType }) => {
  try {
    const validatedParams = validateParams(followSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const follow = await addFollow({
        user,
        object: { objectId: body.objectId, objectType: body.objectType, followedBy: user.providerId },
      });
      return { status: StatusCodes.OK, data: follow };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Adding a follower to a ${body.objectType} ${body.objectId} for user ${user.providerId}`,
      err as Error,
      body.objectId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Following the ${body.objectType} failed`,
    };
  }
});
