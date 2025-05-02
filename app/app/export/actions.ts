'use server';

import { StatusCodes } from 'http-status-codes';
import { json2csv } from 'json-2-csv';

import { getCheckinQuestionVoteHistory } from '@/repository/db/checkin_votes';
import dbClient from '@/repository/db/prisma/prisma';
import { formatDateToString, getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { getAllCheckinQuestions } from '@/utils/requests/checkinQuestions/requests';
import { getProjects } from '@/utils/requests/project/requests';
import { checkCredentials, getOverallStats, getProjectsStats } from '@/utils/requests/statistics/requests';

const logger = getLogger();

export const generatePlatformStatistics = async (body: { username: string; password: string }) => {
  const { username, password } = body;
  if (!(await checkCredentials(username, password))) {
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

  if (!(await checkCredentials(username, password))) {
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

export const generateDailyCheckinStatistics = async (body: { username: string; password: string }) => {
  const { username, password } = body;

  if (!(await checkCredentials(username, password))) {
    logger.error('Invalid credentials for downloading feedback');
    return {
      status: StatusCodes.UNAUTHORIZED,
      data: 'Invalid credentials',
    };
  }

  const questions = await getAllCheckinQuestions();

  const voteHistoryPromises = questions.map(async (question) => {
    if (!question) return;
    const history = await getCheckinQuestionVoteHistory(dbClient, question.documentId);
    if (!history) return;

    return history.map((h) => ({
      questionId: question.documentId,
      question: question.question,
      validFrom: question.validFrom,
      validTo: question.validTo,
      answeredOn: formatDateToString(h.answeredOn),
      average: h._avg.vote,
      numberOfVotes: h._count.votedBy,
    }));
  });

  const historyResults = await getPromiseResults(voteHistoryPromises);

  const res = historyResults.flat();
  if (!res) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: 'Could not find questions',
    };
  }

  return {
    status: StatusCodes.OK,
    data: json2csv(res),
  };
};
