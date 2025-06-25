'use server';

import { StatusCodes } from 'http-status-codes';

import {
  BasicSurveyQuestion,
  ObjectType,
  StartPagination,
  SurveyQuestion,
  SurveyVote,
  UserSession,
} from '@/common/types';
import { RequestError } from '@/entities/error';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { getSurveyVotes } from '@/repository/db/survey_votes';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError, strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { mapToBasicSurveyQuestion, mapToSurveyQuestion } from '@/utils/requests/surveyQuestions/mappings';
import { GetSurveysStartingFromQuery } from '@/utils/requests/surveyQuestions/queries';

import { GetSurveyQuestionByIdQuery } from './queries';

const logger = getLogger();

export async function getBasicSurveyQuestionById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetSurveyQuestionByIdQuery, { id });
    const data = response.surveyQuestion;

    if (!data) throw new Error('Response contained no survey question data');

    const surveyQuestion = mapToBasicSurveyQuestion(data);
    return surveyQuestion;
  } catch (err) {
    const error = strapiError('Getting basic survey question by id', err as RequestError, id);
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

export async function getSurveyQuestionByIdWithReactions(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetSurveyQuestionByIdQuery, { id });
    if (!response?.surveyQuestion) throw new Error('Response contained no survey question');
    const surveyQuestionResponse = response.surveyQuestion;
    const votes = await getSurveyVotes(dbClient, surveyQuestionResponse.documentId);
    const surveyQuestion = mapToSurveyQuestion(surveyQuestionResponse, votes);
    if (!surveyQuestion) throw new Error('Mapping survey question failed');
    const reactions = await getReactionsForEntity(dbClient, ObjectType.SURVEY_QUESTION, surveyQuestion.id);
    return { ...surveyQuestion, reactions };
  } catch (err) {
    const error = strapiError('Getting survey question', err as RequestError);
    logger.error(error);
    throw err;
  }
}

export async function getSurveyQuestionById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetSurveyQuestionByIdQuery, { id });
    if (!response?.surveyQuestion) throw new Error('Response contained no survey question');
    const survey = response.surveyQuestion;
    const votes = await getSurveyVotes(dbClient, survey.documentId);
    const surveyQuestion = mapToSurveyQuestion(survey, votes);
    if (!surveyQuestion) throw new Error('Mapping survey question failed');
    return surveyQuestion;
  } catch (err) {
    const error = strapiError('Getting survey question by id', err as RequestError, id);
    logger.error(error);
    throw err;
  }
}

export async function getSurveyQuestionsStartingFrom({ from, page, pageSize }: StartPagination) {
  try {
    const response = await strapiGraphQLFetcher(GetSurveysStartingFromQuery, { from, page, pageSize });
    const surveyQuestionsData = response.surveyQuestions;

    if (!surveyQuestionsData) throw new Error('Response contained no survey question data');

    const mapToEntities = surveyQuestionsData.map(async (surveyQuestionData) => {
      const votes = await getSurveyVotes(dbClient, surveyQuestionData.documentId);
      const surveyQuestion = mapToSurveyQuestion(surveyQuestionData, votes);
      return surveyQuestion;
    });
    const surveyQuestions = await getPromiseResults(mapToEntities);
    return surveyQuestions;
  } catch (err) {
    const error = strapiError('Getting upcoming survey questions', err as RequestError);
    logger.error(error);
    throw err;
  }
}

export async function getSurveyQuestionsWithAdditionalData(surveys: BasicSurveyQuestion[]) {
  const getAdditionalData = surveys.map(getSurveyQuestionWithAdditionalData);
  const surveyQuestionsWithAdditionalData = await getPromiseResults(getAdditionalData);
  return surveyQuestionsWithAdditionalData;
}

export async function getSurveyQuestionWithAdditionalData(
  surveyQuestion: BasicSurveyQuestion,
): Promise<SurveyQuestion> {
  try {
    const votes = await getSurveyVotes(dbClient, surveyQuestion.id);
    const userVote = await findUserVote({ votes });
    if (userVote.status !== StatusCodes.OK) {
      throw userVote.errors ?? new Error('Failed to find user vote for survey question');
    }
    return {
      ...surveyQuestion,
      votes,
      userVote: userVote.data?.vote ?? undefined,
      responseOptions: surveyQuestion.responseOptions ?? [],
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting additional data for survey question with id: ${surveyQuestion.id}`,
      err as Error,
      surveyQuestion.id,
    );
    logger.error(error);
    throw err;
  }
}
