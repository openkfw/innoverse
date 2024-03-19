'use server';

import { StatusCodes } from 'http-status-codes';
import { json2csv } from 'json-2-csv';

import { UserSession } from '@/common/types';
import { getCollaborationQuestionComments } from '@/repository/db/collaboration_comment';
import dbClient from '@/repository/db/prisma/prisma';
import { withAuth } from '@/utils/auth';
import logger from '@/utils/logger';
import { GetPlatformFeedbackCollaborationQuestion, STRAPI_QUERY, withResponseTransformer } from '@/utils/queries';
import strapiFetcher from '@/utils/strapiFetcher';

export const getFeedback = withAuth(async (user: UserSession, body: { username: string; password: string }) => {
  const { username, password } = body;
  if (!checkCredentials(username, password)) {
    logger.error('Invalid credentials for downloading feedback');
    return {
      status: StatusCodes.UNAUTHORIZED,
      data: 'Invalid credentials',
    };
  }
  const request = await strapiFetcher(GetPlatformFeedbackCollaborationQuestion);
  const { collaborationQuestionId: questionId, projectId } = (await withResponseTransformer(
    STRAPI_QUERY.GetPlatformFeedbackCollaborationQuestion,
    request,
  )) as unknown as { collaborationQuestionId: string; projectId: string };
  const feedback = await getCollaborationQuestionComments(dbClient, projectId, questionId);
  return {
    status: StatusCodes.OK,
    data: json2csv(feedback),
  };
});

const checkCredentials = (username: string, password: string) => {
  const [AUTH_USER, AUTH_PASS] = (process.env.HTTP_BASIC_AUTH || ':').split(':');
  return username == AUTH_USER && password == AUTH_PASS;
};
