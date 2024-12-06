'use server';

import { StatusCodes } from 'http-status-codes';

import { ObjectType, StartPagination, SurveyVote, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import dbClient from '@/repository/db/prisma/prisma';
import { getSurveyVotes } from '@/repository/db/survey_votes';
import { withAuth } from '@/utils/auth';
import { strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { mapToBasicSurveyQuestion, mapToSurveyQuestion } from '@/utils/requests/surveyQuestions/mappings';
import {
  GetSurveyQuestionsByProjectIdQuery,
  GetSurveyQuestionsCountByProjectIdQuery,
  GetSurveysStartingFromQuery,
} from '@/utils/requests/surveyQuestions/queries';

import { GetSurveyQuestionByIdQuery } from './queries';
import { getReactionsForEntity } from '@/repository/db/reaction';

const logger = getLogger();

export async function getBasicSurveyQuestionById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetSurveyQuestionByIdQuery, { id });
    const data = response.surveyQuestion?.data;

    if (!data) throw new Error('Response contained no survey question data');

    const surveyQuestion = mapToBasicSurveyQuestion(data);
    return surveyQuestion;
  } catch (err) {
    const error = strapiError('Getting basic survey question by id', err as RequestError, id);
    logger.error(error);
  }
}

export async function getSurveyQuestionsByProjectId(projectId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetSurveyQuestionsByProjectIdQuery, { projectId });
    const surveyQuestionsData = response.surveyQuestions;

    if (!surveyQuestionsData?.data) throw new Error('Response contained no survey question data');

    const mapToEntities = surveyQuestionsData.data.map(async (surveyQuestionData) => {
      const votes = await getSurveyVotes(dbClient, surveyQuestionData.id);
      const userVote = await findUserVote({ votes });
      const surveyQuestion = mapToSurveyQuestion(surveyQuestionData, votes, userVote.data);
      return surveyQuestion;
    });

    const surveyQuestions = await getPromiseResults(mapToEntities);
    return surveyQuestions;
  } catch (err) {
    const error = strapiError('Getting all survey questions', err as RequestError, projectId);
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

export const countSurveyQuestionsForProject = async (projectId: string) => {
  try {
    const response = await strapiGraphQLFetcher(GetSurveyQuestionsCountByProjectIdQuery, { projectId });
    const countResult = response.surveyQuestions?.meta.pagination.total;

    return { status: StatusCodes.OK, data: countResult };
  } catch (err) {
    const error = strapiError('Error fetching survey questions count for project', err as RequestError);
    logger.error(error);
    throw err;
  }
};

export async function getSurveyQuestionByIdWithReactions(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetSurveyQuestionByIdQuery, { id });
    if (!response?.surveyQuestion?.data) throw new Error('Response contained no survey question');
    const votes = await getSurveyVotes(dbClient, response.surveyQuestion?.data.id);
    const surveyQuestion = mapToSurveyQuestion(response.surveyQuestion.data, votes);
    const reactions = await getReactionsForEntity(dbClient, ObjectType.SURVEY_QUESTION, surveyQuestion.id);
    return { ...surveyQuestion, reactions };
  } catch (err) {
    const error = strapiError('Getting survey question', err as RequestError);
    logger.error(error);
  }
}

export async function getSurveyQuestionById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetSurveyQuestionByIdQuery, { id });
    const survey = response.surveyQuestion?.data;
    if (!survey) return null;
    if (!response?.surveyQuestion?.data) throw new Error('Response contained no survey question');
    const votes = await getSurveyVotes(dbClient, response.surveyQuestion?.data?.id);
    const surveyQuestion = mapToSurveyQuestion(survey, votes);
    return surveyQuestion;
  } catch (err) {
    const error = strapiError('Getting project update by id', err as RequestError, id);
    logger.error(error);
  }
}

export async function getSurveyQuestionsStartingFrom({ from, page, pageSize }: StartPagination) {
  try {
    const response = await strapiGraphQLFetcher(GetSurveysStartingFromQuery, { from, page, pageSize });
    const surveyQuestionsData = response.surveyQuestions;

    if (!surveyQuestionsData?.data) throw new Error('Response contained no survey question data');

    const mapToEntities = surveyQuestionsData.data.map(async (surveyQuestionData) => {
      const votes = await getSurveyVotes(dbClient, surveyQuestionData.id);
      const surveyQuestion = mapToSurveyQuestion(surveyQuestionData, votes);
      return surveyQuestion;
    });

    const surveyQuestions = await getPromiseResults(mapToEntities);
    return surveyQuestions;
  } catch (err) {
    const error = strapiError('Getting upcoming survey questions', err as RequestError);
    logger.error(error);
  }
}
