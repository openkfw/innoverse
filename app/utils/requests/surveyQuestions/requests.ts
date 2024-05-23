'use server';

import { StatusCodes } from 'http-status-codes';

import { SurveyVote, UserSession } from '@/common/types';
import dbClient from '@/repository/db/prisma/prisma';
import { getSurveyVotes } from '@/repository/db/survey_votes';
import {
  GetSurveyQuestionsByProjectIdQuery,
  GetSurveyQuestionsCountByProjectIdQuery,
} from '@/utils/requests/surveyQuestions/queries';
import { withAuth } from '@/utils/auth';
import { strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { mapToBasicSurveyQuestion, mapToSurveyQuestion } from '@/utils/requests/surveyQuestions/mappings';

import { GetSurveyQuestionByIdQuery } from './queries';

const logger = getLogger();

export async function getBasicSurveyQuestionById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetSurveyQuestionByIdQuery, { id });
    const data = response.surveyQuestion?.data;

    if (!data) throw new Error('Response contained no survey question data');

    const surveyQuestion = mapToBasicSurveyQuestion(data);
    return surveyQuestion;
  } catch (err) {
    const error = strapiError('Getting basic survey question by id', err as Error, id);
    logger.error(error);
  }
}

export async function getSurveyQuestionsByProjectId(projectId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetSurveyQuestionsByProjectIdQuery, { projectId });
    const surveyQuestionsData = response.surveyQuestions?.data;

    if (!surveyQuestionsData) throw new Error('Response contained no survey question data');

    const mapToEntities = surveyQuestionsData.map(async (surveyQuestionData) => {
      const votes = await getSurveyVotes(dbClient, surveyQuestionData.id);
      const userVote = await findUserVote({ votes });
      const surveyQuestion = mapToSurveyQuestion(surveyQuestionData, votes, userVote.data);
      return surveyQuestion;
    });

    const surveyQuestions = await getPromiseResults(mapToEntities);
    return surveyQuestions;
  } catch (err) {
    const error = strapiError('Getting all survey questions', err as Error, projectId);
    logger.error(error);
  }
}

export const findUserVote = withAuth((user: UserSession, body: { votes: SurveyVote[] }) => {
  const userVote = body.votes.find((vote) => vote.votedBy === user.providerId);

  return Promise.resolve({
    status: StatusCodes.OK,
    data: userVote,
  });
});

export const countSurveyQuestionsForProject = withAuth(async (user, body: { projectId: string }) => {
  try {
    const response = await strapiGraphQLFetcher(GetSurveyQuestionsCountByProjectIdQuery, { projectId: body.projectId });
    const countResult = response.surveyQuestions?.meta.pagination.total;

    return { status: StatusCodes.OK, data: countResult };
  } catch (err) {
    const error = strapiError('Error fetching survey questions count for project', err as Error);
    logger.error(error);
    throw err;
  }
});
