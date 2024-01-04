'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import {
  addFollower,
  deleteProjectAndUserFollower,
  getProjectAndUserFollowers,
  getProjectFollowers,
} from '@/repository/db/follow';
import { addLike, deleteProjectAndUserLike, getProjectAndUserLikes, getProjectLikes } from '@/repository/db/like';
import { withAuth } from '@/utils/auth';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import { followSchema, likeSchema } from './validationSchema';

export const handleLike = withAuth(async (user: UserSession, body: { projectId: string }) => {
  const validatedParams = validateParams(likeSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    await addLike(dbClient, body.projectId, user.providerId);
    return { status: StatusCodes.OK };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const handleRemoveLike = withAuth(async (user: UserSession, body: { projectId: string }) => {
  const validatedParams = validateParams(likeSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    await deleteProjectAndUserLike(dbClient, body.projectId, user.providerId);
    return { status: StatusCodes.OK };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const isLiked = withAuth(async (user: UserSession, body: { projectId: string }) => {
  const validatedParams = validateParams(likeSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await getProjectAndUserLikes(dbClient, body.projectId, user.providerId);
    return { status: StatusCodes.OK, data: result.length > 0 };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const getAllProjectLikes = async (body: { projectId: string }) => {
  const validatedParams = validateParams(likeSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await getProjectLikes(dbClient, body.projectId);
    return { status: StatusCodes.OK, data: result };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
};

export const getAllProjectFollowers = async (body: { projectId: string }) => {
  const validatedParams = validateParams(followSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await getProjectFollowers(dbClient, body.projectId);
    return { status: StatusCodes.OK, data: result };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
};

export const handleRemoveFollower = withAuth(async (user: UserSession, body: { projectId: string }) => {
  const validatedParams = validateParams(followSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    await deleteProjectAndUserFollower(dbClient, body.projectId, user.providerId);
    return { status: StatusCodes.OK };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const isFollowed = withAuth(async (user: UserSession, body: { projectId: string }) => {
  const validatedParams = validateParams(followSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await getProjectAndUserFollowers(dbClient, body.projectId, user.providerId);
    return { status: StatusCodes.OK, data: result.length > 0 };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const handleFollow = withAuth(async (user: UserSession, body: { projectId: string }) => {
  const validatedParams = validateParams(followSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    await addFollower(dbClient, body.projectId, user.providerId);
    return { status: StatusCodes.OK };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});
