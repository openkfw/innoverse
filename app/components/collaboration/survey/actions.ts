'use server';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { handleSurveyQuestionVote } from '@/services/surveyQuestionService';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { validateParams } from '@/utils/validationHelper';

import { handleSurveyVoteSchema } from './validationSchema';

const logger = getLogger();

export const handleSurveyVote = withAuth(
  async (user: UserSession, body: { projectId: string; surveyQuestionId: string; vote: string }) => {
    try {
      const validatedParams = validateParams(handleSurveyVoteSchema, body);
      if (validatedParams.status === StatusCodes.OK) {
        const surveyVote = await handleSurveyQuestionVote({
          projectId: body.projectId,
          providerId: user.providerId,
          surveyQuestionId: body.surveyQuestionId,
          vote: body.vote,
        });

        return {
          status: StatusCodes.OK,
          data: surveyVote,
        };
      }

      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Add vote for survey ${body.surveyQuestionId}`,
        err as Error,
        body.surveyQuestionId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Voting for survey failed',
      };
    }
  },
);
