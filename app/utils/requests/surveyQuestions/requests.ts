'use server';

import { StatusCodes } from 'http-status-codes';

import { SurveyVote, UserSession } from '@/common/types';
import dbClient from '@/repository/db/prisma/prisma';
import { getSurveyVotes } from '@/repository/db/survey_votes';
import { withAuth } from '@/utils/auth';
import { strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { mapToSurveyQuestion } from '@/utils/requests/surveyQuestions/mappings';
import { GetSurveyQuestionsByProjectIdQuery } from '@/utils/requests/surveyQuestions/queries';

const logger = getLogger();

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
