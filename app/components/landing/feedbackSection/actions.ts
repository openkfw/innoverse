'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { handleFeedbackSchema } from '@/components/landing/feedbackSection/validationSchema';
import { addCollaborationComment } from '@/services/collaborationCommentService';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { getPlatformFeedbackCollaborationQuestion } from '@/utils/requests/collaborationQuestions/requests';
import { validateParams } from '@/utils/validationHelper';

const logger = getLogger();

export const saveFeedback = withAuth(
  async (user: UserSession, body: { feedback: string; showOnProjectPage: boolean }) => {
    const question = await getPlatformFeedbackCollaborationQuestion();

    try {
      const validatedParams = validateParams(handleFeedbackSchema, body);
      if (validatedParams.status === StatusCodes.OK && question) {
        const { feedback, showOnProjectPage } = body;

        await addCollaborationComment({
          comment: {
            projectId: question.projectId,
            questionId: question.collaborationQuestionId,
            text: feedback,
            anonymous: showOnProjectPage,
          },
          user,
        });
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
