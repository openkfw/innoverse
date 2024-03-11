'use server';

import { StatusCodes } from 'http-status-codes';

import { Project, User, UserSession } from '@/common/types';
import { withAuth } from '@/utils/auth';
import { createProjectUpdate, getInnoUserByProviderId, getProjects } from '@/utils/requests';
import { validateParams } from '@/utils/validationHelper';

import { AddUpdateFormData } from './AddUpdateForm';
import { handleProjectUpdateSchema } from './validationSchema';

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
  async (user: UserSession, body: Omit<AddUpdateFormData, 'authorId' | 'author'>) => {
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
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        errors: 'Creating a project update failed',
      };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  },
);
