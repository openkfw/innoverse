'use server';

import { StatusCodes } from 'http-status-codes';
import { json2csv } from 'json-2-csv';

import { UserSession } from '@/common/types';
import { getCollaborationQuestionComments } from '@/repository/db/collaboration_comment';
import dbClient from '@/repository/db/prisma/prisma';
import { withAuth } from '@/utils/auth';
import getLogger from '@/utils/logger';
import { getPlatformFeedbackCollaborationQuestion } from '@/utils/requests/collaborationQuestions/requests';

const logger = getLogger();

export const getFeedback = withAuth(async (user: UserSession, body: { username: string; password: string }) => {
  const { username, password } = body;
  if (!checkCredentials(username, password)) {
    logger.error('Invalid credentials for downloading feedback');
    return {
      status: StatusCodes.UNAUTHORIZED,
      data: 'Invalid credentials',
    };
  }

  const question = await getPlatformFeedbackCollaborationQuestion();

  if (!question) {
    return { status: StatusCodes.BAD_REQUEST };
  }

  const feedback = await getCollaborationQuestionComments(
    dbClient,
    question.projectId,
    question.collaborationQuestionId,
  );

  return {
    status: StatusCodes.OK,
    data: json2csv(feedback),
  };
});

const checkCredentials = (username: string, password: string) => {
  const [AUTH_USER, AUTH_PASS] = (process.env.HTTP_BASIC_AUTH || ':').split(':');
  return username == AUTH_USER && password == AUTH_PASS;
};
