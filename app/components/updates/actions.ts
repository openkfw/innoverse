'use server';
import { StatusCodes } from 'http-status-codes';

import { getUpdatesByProjectId } from '@/utils/requests/updates/requests';
import { validateParams } from '@/utils/validationHelper';

import { handleProjectUpdatesSchema } from './validationSchema';

export const getProjectUpdates = async (body: { projectId: string }) => {
  const validatedParams = validateParams(handleProjectUpdatesSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const updatesWithAdditionalData = await getUpdatesByProjectId(body.projectId);
    return {
      status: StatusCodes.OK,
      data: updatesWithAdditionalData,
    };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
};
