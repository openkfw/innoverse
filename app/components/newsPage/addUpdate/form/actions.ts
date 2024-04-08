'use server';

import { StatusCodes } from 'http-status-codes';

import { Project, User, UserSession } from '@/common/types';
import { withAuth } from '@/utils/auth';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { createProjectUpdate, getInnoUserByProviderId, getProjects } from '@/utils/requests';
import { validateParams } from '@/utils/validationHelper';

import { UpdateFormData } from './AddUpdateForm';
import { handleProjectUpdateSchema } from './validationSchema';

const logger = getLogger();
export const getProjectsOptions = async () => {
  const projects = (await getProjects()) as Project[];
  return projects.map((project) => {
    return {
      label: project.title,
      value: project.id,
    };
  });
};

export const handleProjectUpdate = withAuth(
  async (user: UserSession, body: Omit<UpdateFormData, 'authorId' | 'author'>) => {
    const validatedParams = validateParams(handleProjectUpdateSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const author = (await getInnoUserByProviderId(user.providerId)) as User;
      if (author) {
        const newUpdate = await createProjectUpdate({ ...body, authorId: author.id });
        return {
          status: StatusCodes.OK,
          data: {
            ...newUpdate,
            author: user,
          },
        };
      }
      const error: InnoPlatformError = strapiError(
        `Creating a project update by user ${user.providerId}`,
        new Error('InnoUser does not exist'),
        body.projectId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        errors: 'Creating a project update failed',
      };
    }

    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  },
);
