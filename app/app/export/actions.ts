'use server';

import { StatusCodes } from 'http-status-codes';
import { json2csv } from 'json-2-csv';

import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { getProjects } from '@/utils/requests/project/requests';
import { checkCredentials, getOverallStats, getProjectsStats } from '@/utils/requests/statistics/requests';

const logger = getLogger();

export const generatePlatformStatistics = async (body: { username: string; password: string }) => {
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
};

export const generateProjectsStatistics = async (body: { username: string; password: string }) => {
  const { username, password } = body;

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

  const response = await getProjects();
  const projects = response?.map((project) => project.id) ?? [];

  const projectsStatisticsPromises = projects.map((projectId) => getProjectsStats(projectId));
  const projectsStatistics = await getPromiseResults(projectsStatisticsPromises);

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
};
