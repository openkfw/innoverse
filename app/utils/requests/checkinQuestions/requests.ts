'use server';

import { StatusCodes } from 'http-status-codes';

import { SurveyVote, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { withAuth } from '@/utils/auth';
import { strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

import { GetCheckinQuestionByIdQuery, GetCheckinQuestionByValidDates } from './queries';
import { isCheckinQuestionVotedByToday, getCheckinQuestionVoteHistory } from '@/repository/db/checkin_votes';
import { getPromiseResults } from '@/utils/helpers';
import dbClient from '@/repository/db/prisma/prisma';
import { PrismaClient } from '@prisma/client';

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
    const checkinQuestionsData = await getStrapiCheckinQuestions();

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

const getStrapiCheckinQuestions = async () => {
  const currentDate = new Date().toISOString().split('T')[0];
  const response = await strapiGraphQLFetcher(GetCheckinQuestionByValidDates, { currentDate });
  const checkinQuestionsData = response.checkinQuestions;

  if (!checkinQuestionsData) throw new Error('Response contained no check-in question data');
  return checkinQuestionsData;
};

export const getCheckinQuestionsHistory = withAuth(async (user: UserSession) => {
  try {
    const checkinQuestionsData = await getStrapiCheckinQuestions();
    const mapQuestionWithUserVote = checkinQuestionsData.map(async (checkinQuestionData) => {
      if (checkinQuestionData) {
        const voteHistory = await getSortedVoteHistory(dbClient, checkinQuestionData.documentId);

        return {
          checkinQuestionId: checkinQuestionData.documentId,
          question: checkinQuestionData.question,
          voteHistory,
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

const getSortedVoteHistory = async (dbClient: PrismaClient, documentId: string) => {
  const voteHistory = await getCheckinQuestionVoteHistory(dbClient, documentId);
  const simplifiedAndSortedVotes = voteHistory
    .map(({ createdAt, vote }) => ({ createdAt, vote }))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return simplifiedAndSortedVotes;
};
