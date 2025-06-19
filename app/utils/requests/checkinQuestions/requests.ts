'use server';

import { StatusCodes } from 'http-status-codes';

import { SurveyVote, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import {
  getCheckinQuestionUserVoteHistory,
  getCheckinQuestionVoteHistory,
  isCheckinQuestionVotedByToday,
} from '@/repository/db/checkin_votes';
import dbClient from '@/repository/db/prisma/prisma';
import { withAuth } from '@/utils/auth';
import { strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

import { GetAllCheckinQuestions, GetCheckinQuestionByIdQuery, GetCheckinQuestionByValidDates } from './queries';

const logger = getLogger();

export async function getCheckinQuestionById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetCheckinQuestionByIdQuery, { id });
    const data = response.checkinQuestion;

    if (!data) throw new Error('Response contained no check-in question data');

    return data;
  } catch (err) {
    const error = strapiError('Getting basic check-in question by id', err as RequestError, id);
    logger.error(error);
    throw err;
  }
}

export const findUserVote = withAuth(async (user: UserSession, body: { votes: SurveyVote[] }) => {
  const userVote = body.votes.find((vote) => vote.votedBy === user.providerId);

  return {
    status: StatusCodes.OK,
    data: userVote,
  };
});

export const getCurrentCheckinQuestions = withAuth(async (user: UserSession) => {
  try {
    const checkinQuestionsData = await getStrapiCheckinQuestionsByCurrentDate();

    const mapQuestionWithUserVote = checkinQuestionsData.map(async (checkinQuestionData) => {
      if (checkinQuestionData) {
        const hasVotedToday = await isCheckinQuestionVotedByToday(
          dbClient,
          checkinQuestionData.documentId,
          user.providerId,
        );
        if (!hasVotedToday) {
          return {
            checkinQuestionId: checkinQuestionData.documentId,
            question: checkinQuestionData.question,
          };
        }
      }
    });

    const data = await getPromiseResults(mapQuestionWithUserVote);
    return {
      status: StatusCodes.OK,
      data,
    };
  } catch (err) {
    const error = strapiError('Getting current check-in questions', err as RequestError);
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting current check-in questions failed',
    };
  }
});

const getStrapiCheckinQuestionsByCurrentDate = async () => {
  const currentDate = new Date().toISOString().split('T')[0];
  const response = await strapiGraphQLFetcher(GetCheckinQuestionByValidDates, { currentDate });
  const checkinQuestionsData = response.checkinQuestions;

  if (!checkinQuestionsData) throw new Error('Response contained no check-in question data');
  return checkinQuestionsData;
};

export const getCheckinQuestionsHistory = withAuth(async (user: UserSession) => {
  try {
    const checkinQuestionsData = await getStrapiCheckinQuestionsByCurrentDate();
    const mapQuestionWithUserVote = checkinQuestionsData.map(async (checkinQuestionData) => {
      if (checkinQuestionData) {
        const voteHistory = await getCheckinQuestionVoteHistory(dbClient, checkinQuestionData.documentId);
        const userVoteHistory = await getCheckinQuestionUserVoteHistory(
          dbClient,
          checkinQuestionData.documentId,
          user.providerId,
        );

        return {
          checkinQuestionId: checkinQuestionData.documentId,
          question: checkinQuestionData.question,
          voteHistory,
          userVoteHistory,
        };
      }
    });

    const data = await getPromiseResults(mapQuestionWithUserVote);
    return {
      status: StatusCodes.OK,
      data,
    };
  } catch (err) {
    const error = strapiError('Getting current check-in question history', err as RequestError);
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting current check-in question history failed',
    };
  }
});

export const getAllCheckinQuestions = async () => {
  const response = await strapiGraphQLFetcher(GetAllCheckinQuestions);
  const checkinQuestionsData = response.checkinQuestions;

  if (!checkinQuestionsData) throw new Error('Response contained no check-in question data');
  return checkinQuestionsData;
};
