'use server';

import { StatusCodes } from 'http-status-codes';

import { SurveyVote, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { withAuth } from '@/utils/auth';
import { strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

import { GetCheckinQuestionByIdQuery, GetCheckinQuestionByValidDates } from './queries';

const logger = getLogger();

export async function getCheckinQuestionById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetCheckinQuestionByIdQuery, { id });
    const data = response.checkinQuestion;

    if (!data) throw new Error('Response contained no check-in question data');

    // const surveyQuestion = mapToBasicSurveyQuestion(data);
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

export async function getCheckinQuestionsByValidDates(validFrom: Date, validTo: Date) {
  try {
    const response = await strapiGraphQLFetcher(GetCheckinQuestionByValidDates, { validFrom, validTo });
    const checkinQuestionsData = response.checkinQuestions;

    if (!checkinQuestionsData) throw new Error('Response contained no check-in question data');

    // const mapToEntities = checkinQuestionsData.map(async (surveyQuestionData) => {
    //   const votes = await getSurveyVotes(dbClient, surveyQuestionData.documentId);
    //   const surveyQuestion = mapToSurveyQuestion(surveyQuestionData, votes);
    //   return surveyQuestion;
    // });
    // const surveyQuestions = await getPromiseResults(mapToEntities);
    return checkinQuestionsData;
  } catch (err) {
    const error = strapiError('Getting upcoming check-in questions', err as RequestError);
    logger.error(error);
  }
}
