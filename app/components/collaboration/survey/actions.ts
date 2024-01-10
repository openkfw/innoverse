'use server';
import type { SurveyVote } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { getSurveyVotes, getSuveyQuestionAndUserVote, handleSurveyQuestionVote } from '@/repository/db/survey_votes';
import { withAuth } from '@/utils/auth';
import { getFulfilledResults, sortDateByCreatedAt } from '@/utils/helpers';
import { getInnoUserByProviderId } from '@/utils/requests';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import { handleSurveyVoteSchema, voteSchema } from './validationSchema';

export const getSurveyQuestionVotes = async (body: { surveyQuestionId: string }) => {
  const validatedParams = validateParams(voteSchema, body);

  if (validatedParams.status === StatusCodes.OK) {
    const result = await getSurveyVotes(dbClient, body.surveyQuestionId);
    const surveyVotes = await Promise.allSettled(
      (sortDateByCreatedAt(result) as SurveyVote[]).map(async (surveyVote) => {
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
  };
};

export const handleSurveyVote = withAuth(
  async (user: UserSession, body: { projectId: string; surveyQuestionId: string; vote: string }) => {
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
    };
  },
);

export const getUserVoted = withAuth(async (user: UserSession, body: { surveyQuestionId: string }) => {
  const validatedParams = validateParams(voteSchema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await getSuveyQuestionAndUserVote(dbClient, body.surveyQuestionId, user.providerId);
    return { status: StatusCodes.OK, data: result };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});
