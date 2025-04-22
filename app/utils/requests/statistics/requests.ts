'use server';

import { StatusCodes } from 'http-status-codes';
import { json2csv } from 'json-2-csv';

import { ObjectType } from '@/common/types';
import { serverConfig } from '@/config/server';
import { getCommentsByAdditionalObjectId } from '@/repository/db/comment';
import dbClient from '@/repository/db/prisma/prisma';
import { getTotalComments, getTotalProjectLikes, getTotalReactions } from '@/repository/db/statistics';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

import { getPlatformFeedbackCollaborationQuestion } from '../collaborationQuestions/requests';

const logger = getLogger();
const add = (acc: number, el: { _count: number }) => acc + el._count;

export const getFeedback = async (body: { username: string; password: string }) => {
  try {
    const { username, password } = body;
    if (!(await checkCredentials(username, password))) {
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

    const feedback = await getCommentsByAdditionalObjectId(
      dbClient,
      response.projectId,
      response.collaborationQuestionId,
    );

    return {
      status: StatusCodes.OK,
      data: json2csv(feedback),
    };
  } catch (err) {
    logger.error('Error getting feedback', err);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: 'Error getting feedback',
    };
  }
};

export const getOverallStats = async () => {
  //returns overall stats for the platform such as: total reactions, total comments, total users, total projects
  try {
    const totalReactionsForNews = await getTotalReactions(dbClient, ObjectType.UPDATE);
    const totalReactionsForEvents = await getTotalReactions(dbClient, ObjectType.EVENT);
    const totalComments = await getTotalComments(dbClient);
    const totalProjectLikes = await getTotalProjectLikes(dbClient);

    return {
      totalReactionsForNews: totalReactionsForNews.reduce(add, 0),
      totalReactionsForEvents: totalReactionsForEvents.reduce(add, 0),
      totalComments: totalComments.reduce(add, 0),
      totalProjectLikes: totalProjectLikes.reduce(add, 0),
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(`Getting overall stats`, err as Error);
    logger.error(error);
    throw err;
  }
};

export const getProjectsStats = async (projectId: string) => {
  try {
    const projectComments = await getTotalComments(dbClient, projectId);
    const projectLikes = await getTotalProjectLikes(dbClient, projectId);

    return {
      projectId,
      projectComments,
      projectLikes,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(`Getting stats for project with id: ${projectId} `, err as Error);
    logger.error(error);
    throw err;
  }
};

export const checkCredentials = async (username: string, password: string) => {
  const [AUTH_USER, AUTH_PASS] = serverConfig.HTTP_BASIC_AUTH.split(':');
  return username == AUTH_USER && password == AUTH_PASS;
};
