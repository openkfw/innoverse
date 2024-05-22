'use server';

import { StatusCodes } from 'http-status-codes';
import { json2csv } from 'json-2-csv';

import { getCollaborationQuestionComments } from '@/repository/db/collaboration_comment';
import dbClient from '@/repository/db/prisma/prisma';
import { getTotalComments, getTotalProjectLikes, getTotalReactions } from '@/repository/db/statistics';
import getLogger from '@/utils/logger';

import { getPlatformFeedbackCollaborationQuestion } from '../collaborationQuestions/requests';
const logger = getLogger();
const add = (acc: number, el: { _count: number }) => acc + el._count;

export const getFeedback = async (body: { username: string; password: string }) => {
  const { username, password } = body;
  if (!checkCredentials(username, password)) {
    logger.error('Invalid credentials for downloading feedback');
    return {
      status: StatusCodes.UNAUTHORIZED,
      data: 'Invalid credentials',
    };
  }
  const response = await getPlatformFeedbackCollaborationQuestion();

  if (!response) {
    return {
      status: StatusCodes.BAD_REQUEST,
      data: 'Could not find project collaboration question',
    };
  }

  const feedback = await getCollaborationQuestionComments(
    dbClient,
    response.projectId,
    response.collaborationQuestionId,
  );

  return {
    status: StatusCodes.OK,
    data: json2csv(feedback),
  };
};

export const getOverallStats = async () => {
  //returns overall stats for the platform such as: total reactions, total comments, total users, total projects
  const totalReactionsForNews = await getTotalReactions(dbClient, 'UPDATE');
  const totalReactionsForEvents = await getTotalReactions(dbClient, 'EVENT');
  const totalComments = await getTotalComments(dbClient);
  const totalProjectLikes = await getTotalProjectLikes(dbClient);

  return {
    totalReactionsForNews: totalReactionsForNews.reduce(add, 0),
    totalReactionsForEvents: totalReactionsForEvents.reduce(add, 0),
    totalComments: totalComments.reduce(add, 0),
    totalProjectLikes: totalProjectLikes.reduce(add, 0),
  };
};

export const getProjectsStats = async (projectId: string) => {
  const projectComments = await getTotalComments(dbClient, projectId);
  const projectLikes = await getTotalProjectLikes(dbClient, projectId);

  return {
    projectId,
    projectComments,
    projectLikes,
  };
};
export const checkCredentials = (username: string, password: string) => {
  const [AUTH_USER, AUTH_PASS] = (process.env.HTTP_BASIC_AUTH || ':').split(':');
  return username == AUTH_USER && password == AUTH_PASS;
};
