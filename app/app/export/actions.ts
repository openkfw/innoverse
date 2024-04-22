'use server';

import { StatusCodes } from 'http-status-codes';
import { json2csv } from 'json-2-csv';

import { UserSession } from '@/common/types';
import { getCollaborationQuestionComments } from '@/repository/db/collaboration_comment';
import dbClient from '@/repository/db/prisma/prisma';
import { getTotalComments, getTotalProjectLikes, getTotalReactions } from '@/repository/db/statistics';
import { withAuth } from '@/utils/auth';
import getLogger from '@/utils/logger';
import {
  GetPlatformFeedbackCollaborationQuestion,
  GetProjectsQuery,
  STRAPI_QUERY,
  withResponseTransformer,
} from '@/utils/queries';
import strapiFetcher from '@/utils/strapiFetcher';
const logger = getLogger();
const add = (acc: number, el: { _count: number }) => acc + el._count;
interface PromiseFulfilledResult<T> {
  status: 'fulfilled';
  value: T;
}

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

export const generatePlatformStatistics = withAuth(
  async (user: UserSession, body: { username: string; password: string }) => {
    const { username, password } = body;
    if (!checkCredentials(username, password)) {
      logger.error('Invalid credentials for downloading platform statistics');
      return {
        status: StatusCodes.UNAUTHORIZED,
        data: 'Invalid credentials',
      };
    }
    const overallStats = await getOverallStats();
    return {
      status: StatusCodes.OK,
      data: json2csv([overallStats]),
    };
  },
);

export const generateProjectsStatistics = withAuth(
  async (user: UserSession, body: { username: string; password: string }) => {
    const { username, password } = body;
    interface ProjectStatisticsRaw {
      projectId: string;
      projectComments: { _count: number }[];
      projectLikes: { _count: number }[];
    }
    interface ProjectStatistics {
      projectId: string;
      projectComments: number;
      projectLikes: number;
    }

    if (!checkCredentials(username, password)) {
      logger.error('Invalid credentials for downloading feedback');
      return {
        status: StatusCodes.UNAUTHORIZED,
        data: 'Invalid credentials',
      };
    }
    const getAllProjects = async () => {
      const response = await strapiFetcher(GetProjectsQuery);
      const result = await withResponseTransformer(STRAPI_QUERY.GetProjects, response);
      return result.projects.map(({ id }) => id);
    };
    const projects = await getAllProjects();

    // I hate to this, but we can't query on a more efficient way as we don't have a direct relation between the projects in strapi & the DB
    // So we need to query each project individually.

    const projectsStatistics = (await Promise.allSettled(projects.map((projectId) => getProjectsStats(projectId))))
      // not fulfilled promises are not interesting for us
      .filter((el) => el.status === 'fulfilled')
      .map((el) => (el as PromiseFulfilledResult<ProjectStatisticsRaw>).value);

    const result = projects.reduce(function (acc, projectId) {
      const stat = projectsStatistics.find((el) => el.projectId === projectId);
      if (stat)
        acc.push({
          projectId: stat.projectId,
          projectComments: stat.projectComments?.at(0)?._count || 0,
          projectLikes: stat.projectLikes?.at(0)?._count || 0,
        });
      return acc;
    }, [] as ProjectStatistics[]);

    return {
      status: StatusCodes.OK,
      data: json2csv(result),
    };
  },
);

const getOverallStats = async () => {
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

const getProjectsStats = async (projectId: string) => {
  const projectComments = await getTotalComments(dbClient, projectId);
  const projectLikes = await getTotalProjectLikes(dbClient, projectId);

  return {
    projectId,
    projectComments,
    projectLikes,
  };
};
const checkCredentials = (username: string, password: string) => {
  const [AUTH_USER, AUTH_PASS] = (process.env.HTTP_BASIC_AUTH || ':').split(':');
  return username == AUTH_USER && password == AUTH_PASS;
};
