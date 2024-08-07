'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { createProjectUpdate } from '@/services/updateService';
import { withAuth } from '@/utils/auth';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests/innoUsers/requests';
import { validateParams } from '@/utils/validationHelper';

import { AddUpdateData } from './AddUpdateForm';
import { handleProjectUpdateSchema } from './validationSchema';

const logger = getLogger();

export const handleProjectUpdate = withAuth(
  async (user: UserSession, body: Omit<AddUpdateData, 'authorId' | 'author'>) => {
    const validatedParams = validateParams(handleProjectUpdateSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    }

    const createInnoPlatformError = (errorMessage: string) => {
      const error: InnoPlatformError = strapiError(
        `Creating a project update by user ${user.providerId}`,
        {
          info: errorMessage,
        } as RequestError,
        body.projectId,
      );
      return error;
    };

    const author = await getInnoUserByProviderId(user.providerId);

    if (!author) {
      const error = createInnoPlatformError('InnoUser does not exist');
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        errors: 'Creating a project update failed',
      };
    }

    const newUpdate = await createProjectUpdate({ ...body, authorId: author.id });

    if (!newUpdate) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        errors: 'Creating a project update failed',
      };
    }

    return {
      status: StatusCodes.OK,
      data: {
        ...newUpdate,
        author: author,
        followedByUser: newUpdate.followedBy?.some((update) => update.providerId === user.providerId),
      },
    };
  },
);
