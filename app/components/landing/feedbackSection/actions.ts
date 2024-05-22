'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { handleFeedbackSchema } from '@/components/landing/feedbackSection/validationSchema';
import { addCollaborationComment } from '@/repository/db/collaboration_comment';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getPlatformFeedbackCollaborationQuestion } from '@/utils/requests/collaborationQuestions/requests';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

const logger = getLogger();

export const saveFeedback = withAuth(
  async (user: UserSession, body: { feedback: string; showOnProjectPage: boolean }) => {
    const question = await getPlatformFeedbackCollaborationQuestion();

    try {
      const validatedParams = validateParams(handleFeedbackSchema, body);
      if (validatedParams.status === StatusCodes.OK && question) {
        const { feedback, showOnProjectPage } = body;

        await addCollaborationComment(
          dbClient,
          question.projectId,
          question.collaborationQuestionId,
          user.providerId,
          feedback,
          showOnProjectPage,
        );
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
        `Adding feedback for the platform (ProjectId: ${question?.projectId} / QuestionId: ${question?.collaborationQuestionId} / showOnProjectPage? ${body.showOnProjectPage}) from user ${user.providerId}`,
        err as Error,
        question?.projectId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Feedback for platform failed',
      };
    }
  },
);
