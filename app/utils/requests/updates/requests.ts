'use server';

import { StatusCodes } from 'http-status-codes';

import { SortValues } from '@/app/contexts/news-filter-context';
import { Filters, ProjectUpdate, ProjectUpdateWithAdditionalData, UserSession } from '@/common/types';
import dbClient from '@/repository/db/prisma/prisma';
import { countNumberOfReactions, findReaction } from '@/repository/db/reaction';
import { withAuth } from '@/utils/auth';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { isProjectFollowedByUser } from '@/utils/requests/project/requests';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { mapToProjectUpdate } from '@/utils/requests/updates/mappings';
import { CreateProjectUpdateMutation } from '@/utils/requests/updates/mutations';
import {
  GetUpdatesByProjectIdQuery,
  GetUpdatesPageByProjectsTitlesAndTopicsQuery,
  GetUpdatesPageByTopicsQuery,
  GetUpdatesPageQuery,
  GetUpdatesQuery,
} from '@/utils/requests/updates/queries';

import { GetUpdatesPageByProjectTitlesQuery } from './queries';

const logger = getLogger();

export async function getProjectUpdates(limit = 100) {
  try {
    const response = await strapiGraphQLFetcher(GetUpdatesQuery, { limit });
    const updatesData = response.updates?.data;
    if (!updatesData) throw new Error('Response contained no updates');

    const updates = updatesData.map(mapToProjectUpdate);
    const updatesWithAdditionalData = getUpdatesWithAdditionalData(updates);
    return updatesWithAdditionalData;
  } catch (err) {
    const error = strapiError('Getting all project updates', err as Error);
    logger.error(error);
  }
}

export async function getUpdatesByProjectId(projectId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetUpdatesByProjectIdQuery, { projectId });
    const updatesData = response.updates?.data;
    if (!updatesData) throw new Error('Response contained no updates');
    const updates = updatesData.map(mapToProjectUpdate);
    return updates;
  } catch (err) {
    const error = strapiError('Getting all project updates', err as Error, projectId);
    logger.error(error);
  }
}

export async function createProjectUpdate(body: { comment: string; projectId: string; authorId?: string }) {
  try {
    const response = await strapiGraphQLFetcher(CreateProjectUpdateMutation, {
      authorId: body.authorId ?? '0',
      projectId: body.projectId,
      comment: body.comment,
    });

    const updateData = response.createUpdate?.data;
    if (!updateData) throw new Error('Response contained no update');

    const update = mapToProjectUpdate(updateData);
    return update;
  } catch (err) {
    const error = strapiError('Trying to to create project update', err as Error, body.projectId);
    logger.error(error);
  }
}

export async function getProjectUpdatesPage({
  filters,
  page = 1,
  pageSize = 10,
  sort = SortValues.DESC,
}: {
  filters: Filters;
  page?: number;
  pageSize?: number;
  sort?: SortValues;
}) {
  try {
    const { projects, topics } = filters;
    const response = await getUpdatesPageData({ projectTitles: projects, topics, page, pageSize, sortDirection: sort });
    const updates = response.updates?.data.map(mapToProjectUpdate) ?? [];
    const updatesWithAdditionalData = await getUpdatesWithAdditionalData(updates);
    return updatesWithAdditionalData;
  } catch (err) {
    const error = strapiError('Getting all project updates with filter', err as Error);
    logger.error(error);
  }
}

const getUpdatesPageData = async ({
  topics,
  projectTitles,
  page,
  pageSize,
  sortDirection,
}: {
  topics: string[];
  projectTitles: string[];
  page: number;
  pageSize: number;
  sortDirection: SortValues;
}) => {
  const sort = `updatedAt:${sortDirection === SortValues.ASC ? 'asc' : 'desc'}`;
  if (topics?.length && projectTitles?.length) {
    return await strapiGraphQLFetcher(GetUpdatesPageByProjectsTitlesAndTopicsQuery, {
      topics,
      projectTitles,
      page,
      pageSize,
      sort,
    });
  } else if (topics?.length) {
    return await strapiGraphQLFetcher(GetUpdatesPageByTopicsQuery, { topics, page, pageSize, sort });
  } else if (projectTitles?.length) {
    return await strapiGraphQLFetcher(GetUpdatesPageByProjectTitlesQuery, { projectTitles, page, pageSize, sort });
  } else {
    return await strapiGraphQLFetcher(GetUpdatesPageQuery, { page, pageSize, sort });
  }
};

export async function getUpdatesWithAdditionalData(updates: ProjectUpdate[]) {
  const getAdditionalData = updates.map(getUpdateWithAdditionalData);
  const updatesWithAdditionalData = await getPromiseResults(getAdditionalData);
  return updatesWithAdditionalData;
}

export async function getUpdateWithAdditionalData(update: ProjectUpdate): Promise<ProjectUpdateWithAdditionalData> {
  const { data: reactionForUser } = await findReactionByUser({ objectType: 'UPDATE', objectId: update.id });
  const reactionCountResult = await countNumberOfReactions(dbClient, 'UPDATE', update.id);
  const { data: followedByUser } = await isProjectFollowedByUser({ projectId: update.projectId });

  const reactionCount = reactionCountResult.map((r) => ({
    count: r._count.shortCode,
    emoji: {
      shortCode: r.shortCode,
      nativeSymbol: r.nativeSymbol,
    },
  }));

  return {
    ...update,
    reactionForUser: reactionForUser || undefined,
    followedByUser,
    reactionCount,
  };
}

export const findReactionByUser = withAuth(
  async (user: UserSession, body: { objectType: 'UPDATE' | 'EVENT'; objectId: string }) => {
    try {
      const result = await findReaction(dbClient, user.providerId, body.objectType, body.objectId);
      return {
        status: StatusCodes.OK,
        data: result,
      };
    } catch (err) {
      const error: InnoPlatformError = strapiError(
        `Find reaction for ${user.providerId} and ${body.objectType} ${body.objectId} `,
        err as Error,
        body.objectId,
      );
      logger.error(error);
      throw err;
    }
  },
);
