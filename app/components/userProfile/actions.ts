'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { withAuth } from '@/utils/auth';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getInnoUserByProviderId, updateInnoUser } from '@/utils/requests/innoUsers/requests';
import { validateParams } from '@/utils/validationHelper';

import { handleUpdateUserSession } from './validationSchema';

const logger = getLogger();

export const updateUserProfile = withAuth(
  async (user: Omit<UserSession, 'image'>, body: Omit<UserSession, 'image'> & { image?: FormData | null }) => {
    const validatedParams = validateParams(handleUpdateUserSession, body);
    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    }

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
        oldImageId: author.imageId,
        ...user,
        ...body,
        id: author.id as string,
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
