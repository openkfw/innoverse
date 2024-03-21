'use server';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { getSurveyVotes, getSuveyQuestionAndUserVote, handleSurveyQuestionVote } from '@/repository/db/survey_votes';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import { getFulfilledResults, sortDateByCreatedAt } from '@/utils/helpers';
import logger from '@/utils/logger';
import { getInnoUserByProviderId } from '@/utils/requests';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import { handleSurveyVoteSchema, voteSchema } from './validationSchema';

export const getSurveyQuestionVotes = async (body: { surveyQuestionId: string }) => {
  try {
    const validatedParams = validateParams(voteSchema, body);

    if (validatedParams.status === StatusCodes.OK) {
      const result = await getSurveyVotes(dbClient, body.surveyQuestionId);
      const surveyVotes = await Promise.allSettled(
        sortDateByCreatedAt(result).map(async (surveyVote) => {
          const votedBy = await getInnoUserByProviderId(surveyVote.votedBy);

          return {
            ...surveyVote,
            votedBy,
          };
        }),
      ).then((results) => getFulfilledResults(results));
      return { status: StatusCodes.OK, data: surveyVotes };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting votes for survey question ${body.surveyQuestionId}`,
      err as Error,
      body.surveyQuestionId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting votes for survey question failed',
    };
  }
};

export const handleSurveyVote = withAuth(
  async (user: UserSession, body: { projectId: string; surveyQuestionId: string; vote: string }) => {
    try {
      const validatedParams = validateParams(handleSurveyVoteSchema, body);
      if (validatedParams.status === StatusCodes.OK) {
        const surveyVote = await handleSurveyQuestionVote(
          dbClient,
          body.projectId,
          body.surveyQuestionId,
          user.providerId,
          body.vote,
        );
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

export const getUserVoted = withAuth(async (user: UserSession, body: { surveyQuestionId: string }) => {
  try {
    const validatedParams = validateParams(voteSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const result = await getSuveyQuestionAndUserVote(dbClient, body.surveyQuestionId, user.providerId);
      return { status: StatusCodes.OK, data: result };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting votes for survey question ${body.surveyQuestionId} for user ${user.providerId}`,
      err as Error,
      body.surveyQuestionId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting votes for survey question failed',
    };
  }
});
