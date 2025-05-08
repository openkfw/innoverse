'use server';

import { StatusCodes } from 'http-status-codes';

import { ObjectType, UserSession } from '@/common/types';
import { handleFeedbackSchema } from '@/components/landing/feedbackSection/validationSchema';
import { addUserComment } from '@/components/newsPage/threads/actions';
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

        await addUserComment({
          projectId: question.projectId,
          comment: feedback,
          objectId: question.collaborationQuestionId,
          objectType: ObjectType.COLLABORATION_QUESTION,
          additionalObjectId: question.projectId,
          additionalObjectType: ObjectType.PROJECT,
          anonymous: showOnProjectPage,
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
