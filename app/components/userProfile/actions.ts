'use server';

import { StatusCodes } from 'http-status-codes';

import { UpdateInnoUser, User, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { getEmailPreferencesForUser, updateEmailPreferencesForUser } from '@/repository/db/email_preferences';
import dbClient from '@/repository/db/prisma/prisma';
import { withAuth, type AuthResponse } from '@/utils/auth';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { batchUpdateInnoUserInCache } from '@/utils/newsFeed/redis/redisService';
import { getInnoUserByProviderId, updateInnoUser } from '@/utils/requests/innoUsers/requests';
import { validateParams } from '@/utils/validationHelper';

import { handleUpdateUserSession, handleUpdateNotificationSettings } from './validationSchema';

const logger = getLogger();

export const updateUserProfile = withAuth(
  async (
    user: Omit<UserSession, 'image'>,
    body: Omit<UpdateInnoUser, 'id' | 'name' | 'oldImageId'>,
  ): Promise<AuthResponse<User | UserSession>> => {
    const validatedParams = validateParams(handleUpdateUserSession, body);
    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    }
    const parsedData = validatedParams.data;

    const createInnoPlatformError = (errorMessage: string) => {
      const error: InnoPlatformError = strapiError(`Updating user profile by user ${user.providerId}`, {
        info: errorMessage,
      } as RequestError);
      return error;
    };

    const author = await getInnoUserByProviderId(user.providerId);

    if (!author) {
      const error = createInnoPlatformError('InnoUser does not exist');
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        errors: 'Updating an Inno User failed',
      };
    }
    try {
      const updatedUser = await updateInnoUser({
        ...parsedData,
        id: author.id as string,
        name: author.name,
        oldImageId: author.imageId,
      });
      await batchUpdateInnoUserInCache({
        providerId: updatedUser.providerId,
        role: updatedUser.role,
        department: updatedUser.department,
        image: updatedUser.image,
      });
      return {
        status: StatusCodes.OK,
        data: updatedUser,
      };
    } catch (error) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  },
);

export const getNotificationSettings = withAuth(async (user: UserSession) => {
  const createInnoPlatformError = (errorMessage: string) => {
    const error: InnoPlatformError = strapiError(`Getting notification settings by user ${user.providerId}`, {
      info: errorMessage,
    } as RequestError);
    return error;
  };

  const author = await getInnoUserByProviderId(user.providerId);

  if (!author) {
    const error = createInnoPlatformError('InnoUser does not exist');
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: 'Getting an Inno User failed',
    };
  }

  const data = await getEmailPreferencesForUser(dbClient, author.id!);

  // TODO just create them
  if (!data) {
    const error = createInnoPlatformError('EmailPreferences does not exist');
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: 'Getting an EmailPreferences failed',
    };
  }

  return {
    status: StatusCodes.OK,
    data,
  };
});

export const updateNotificationSettings = withAuth(async (user: UserSession, body: { weekly: boolean }) => {
  const validatedParams = validateParams(handleUpdateNotificationSettings, body);
  if (validatedParams.status !== 200) {
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  }

  const createInnoPlatformError = (errorMessage: string) => {
    const error: InnoPlatformError = strapiError(`Updating notification settings by user ${user.providerId}`, {
      info: errorMessage,
    } as RequestError);
    return error;
  };

  const author = await getInnoUserByProviderId(user.providerId);

  if (!author) {
    const error = createInnoPlatformError('InnoUser does not exist');
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: 'Updating an Inno User failed',
    };
  }

  try {
    // TODO how can the id be undefined???
    const updatedSettings = await updateEmailPreferencesForUser(dbClient, author.id!, validatedParams.data);

    return {
      status: StatusCodes.OK,
      data: updatedSettings,
    };
  } catch (error) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
});
