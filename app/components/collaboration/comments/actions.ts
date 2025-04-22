'use server';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { getCommentById, updateCommentInDb } from '@/repository/db/comment';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import { updateCollaborationCommentResponseSchema } from './validationSchema';

const logger = getLogger();

export const updateProjectCollaborationCommentResponse = withAuth(
  async (user: UserSession, body: { responseId: string; updatedText: string }) => {
    try {
      const validatedParams = validateParams(updateCollaborationCommentResponseSchema, body);

      if (validatedParams.status !== StatusCodes.OK) {
        return {
          status: validatedParams.status,
          errors: validatedParams.errors,
          message: validatedParams.message,
        };
      }

      const response = await getCommentById(dbClient, body.responseId);

      if (response === null) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: 'No collaboration comment response with the specified ID exists',
        };
      }

      if (response.author !== user.providerId) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: 'A collaboration comment response can only be edited by its author',
        };
      }

      const updatedResponse = await updateCommentInDb(dbClient, body.responseId, body.updatedText);

      return {
        status: StatusCodes.OK,
        comment: updatedResponse,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Updating a Collaboration Comment Response with id: ${body.responseId} by user ${user.providerId}`,
        err as Error,
        body.responseId,
      );
      logger.error(error);
      throw err;
    }
  },
);
