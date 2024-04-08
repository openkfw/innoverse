'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { handleFeedbackSchema } from '@/components/landing/feedbackSection/validationSchema';
import { addCollaborationComment } from '@/repository/db/collaboration_comment';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { GetPlatformFeedbackCollaborationQuestion, STRAPI_QUERY, withResponseTransformer } from '@/utils/queries';
import strapiFetcher from '@/utils/strapiFetcher';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

const logger = getLogger();

export const saveFeedback = withAuth(
  async (user: UserSession, body: { feedback: string; showOnProjectPage: boolean }) => {
    const request = await strapiFetcher(GetPlatformFeedbackCollaborationQuestion);
    const { collaborationQuestionId: questionId, projectId } = (await withResponseTransformer(
      STRAPI_QUERY.GetPlatformFeedbackCollaborationQuestion,
      request,
    )) as unknown as { collaborationQuestionId: string; projectId: string };

    try {
      const validatedParams = validateParams(handleFeedbackSchema, body);
      if (validatedParams.status === StatusCodes.OK) {
        const { feedback, showOnProjectPage } = body;

        await addCollaborationComment(dbClient, projectId, questionId, user.providerId, feedback, showOnProjectPage);
        return {
          status: StatusCodes.OK,
        };
      }
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Adding feedback for the platform (ProjectId: ${projectId} / QuestionId: ${questionId} / showOnProjectPage? ${body.showOnProjectPage}) from user ${user.providerId}`,
        err as Error,
        projectId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Feedback for platform failed',
      };
    }
  },
);
