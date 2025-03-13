'use server';

import { StatusCodes } from 'http-status-codes';

import {
  Filters,
  NewsFeedEntry,
  ObjectType,
  ProjectUpdate,
  ProjectUpdateWithAdditionalData,
  SortValues,
  StartPagination,
  UserSession,
} from '@/common/types';
import { handleProjectUpdatesSchema } from '@/components/updates/validationSchema';
import { RequestError } from '@/entities/error';
import { getCommentsStartingFrom } from '@/repository/db/comment';
import { getFollowedByForEntity } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { countNumberOfReactions, findReaction, getReactionsForEntity } from '@/repository/db/reaction';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError, strapiError } from '@/utils/errors';
import { getPromiseResults, getUniqueValues, getUnixTimestamp } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapReaction } from '@/utils/newsFeed/redis/redisMappings';
import { isProjectFollowedByUser } from '@/utils/requests/project/requests';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { mapToProjectUpdate, mapToProjectUpdates } from '@/utils/requests/updates/mappings';
import {
  CreateProjectUpdateMutation,
  DeleteProjectUpdateMutation,
  UpdateProjectUpdateMutation,
} from '@/utils/requests/updates/mutations';
import {
  GetUpdateByIdQuery,
  GetUpdateCountQuery,
  GetUpdatesByIdsQuery,
  GetUpdatesByProjectIdQuery,
  GetUpdatesPageByProjectsTitlesAndTopicsQuery,
  GetUpdatesPageByProjectTitlesQuery,
  GetUpdatesPageByTopicsQuery,
  GetUpdatesPageQuery,
  GetUpdatesQuery,
  GetUpdatesStartingFromQuery,
} from '@/utils/requests/updates/queries';
import { validateParams } from '@/utils/validationHelper';

const logger = getLogger();

export async function getProjectUpdates(limit = 100) {
  try {
    const response = await strapiGraphQLFetcher(GetUpdatesQuery, { limit });
    const updatesData = response.updates;
    if (!updatesData) throw new Error('Response contained no updates');

    const updates = updatesData.map(mapToProjectUpdate);
    const updatesWithAdditionalData = getUpdatesWithAdditionalData(updates);
    return updatesWithAdditionalData;
  } catch (err) {
    const error = strapiError('Getting all project updates', err as RequestError);
    logger.error(error);
  }
}

export async function getProjectUpdateById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetUpdateByIdQuery, { id });
    const updateData = response.update;
    if (!updateData) return null;
    const update = mapToProjectUpdate(updateData);
    return update;
  } catch (err) {
    const error = strapiError('Getting project update by id', err as RequestError, id);
    logger.error(error);
  }
}

export async function getProjectUpdateByIdWithReactions(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetUpdateByIdQuery, { id });
    if (!response?.update) throw new Error('Response contained no update');
    const update = mapToProjectUpdate(response.update);
    const reactions = await getReactionsForEntity(dbClient, ObjectType.UPDATE, update.id);
    return { ...update, reactions };
  } catch (err) {
    const error = strapiError('Getting project update', err as RequestError);
    logger.error(error);
  }
}

export async function getUpdatesByProjectId(projectId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetUpdatesByProjectIdQuery, { projectId });
    if (!response.updates) throw new Error('Response contained no updates');
    const updatesData = response.updates;
    const updates = updatesData.map(mapToProjectUpdate);
    const updatesWithAdditionalData = getUpdatesWithAdditionalData(updates);
    return updatesWithAdditionalData;
  } catch (err) {
    const error = strapiError('Getting all project updates', err as RequestError, projectId);
    logger.error(error);
  }
}

export async function createProjectUpdateInStrapi(body: {
  comment: string;
  projectId: string;
  authorId?: string;
  linkToCollaborationTab?: boolean;
  anonymous?: boolean;
}) {
  try {
    const response = await strapiGraphQLFetcher(CreateProjectUpdateMutation, {
      authorId: body.authorId ?? '0',
      projectId: body.projectId,
      comment: body.comment,
      linkToCollaborationTab: body.linkToCollaborationTab ?? false,
      anonymous: body.anonymous ?? false,
    });

    const updateData = response.createUpdate;
    if (!updateData) throw 'Response contained no update';

    const update = mapToProjectUpdate(updateData);
    return update;
  } catch (err) {
    const error = strapiError('Trying to to create project update', err as RequestError, body.projectId);
    logger.error(error);
  }
}

export async function deleteProjectUpdateInStrapi(id: string) {
  try {
    const response = await strapiGraphQLFetcher(DeleteProjectUpdateMutation, { updateId: id });
    const updateData = response.deleteUpdate;
    if (!updateData) throw new Error('Response contained no removed project update');
    return updateData.documentId;
  } catch (err) {
    const error = strapiError('Removing project update', err as RequestError, id);
    logger.error(error);
  }
}

export async function updateProjectUpdateInStrapi(id: string, comment: string) {
  try {
    const response = await strapiGraphQLFetcher(UpdateProjectUpdateMutation, {
      updateId: id,
      comment,
    });
    const updatedUpdate = response.updateUpdate;
    if (!updatedUpdate) throw new Error('Response contained no updated project update');
    const update = mapToProjectUpdate(updatedUpdate);
    return update;
  } catch (err) {
    const error = strapiError('Updating project update', err as RequestError, id);
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
    if (!response.updates) throw 'Response contained no project updates';
    const updates = response.updates.map(mapToProjectUpdate) ?? [];
    const updatesWithAdditionalData = await getUpdatesWithAdditionalData(updates);
    return updatesWithAdditionalData;
  } catch (err) {
    const error = strapiError('Getting all project updates with filter', err as RequestError);
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

export const getUpdateWithReactions = withAuth(async (user: UserSession, body: { update: ProjectUpdate }) => {
  const reactions = await getReactionsForEntity(dbClient, ObjectType.UPDATE, body.update.id);
  const followedByIds = await getFollowedByForEntity(dbClient, ObjectType.UPDATE, body.update.id);
  return {
    status: 200,
    data: {
      ...body.update,
      updatedAt: getUnixTimestamp(body.update.updatedAt),
      reactions,
      followedByUser: followedByIds.some((followerId) => followerId === user.providerId),
    },
  };
});

export async function getUpdateWithAdditionalData(
  update: ProjectUpdate | ProjectUpdateWithAdditionalData,
): Promise<ProjectUpdateWithAdditionalData> {
  try {
    const { data: reactionForUser } = await findReactionByUser({ objectType: ObjectType.UPDATE, objectId: update.id });
    const reactionCountResult = await countNumberOfReactions(dbClient, ObjectType.UPDATE, update.id);
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
      reactionForUser: reactionForUser ? mapReaction(reactionForUser) : undefined,
      followedByUser,
      reactionCount,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting additional data for update with id: ${update.id}`,
      err as Error,
      update.id,
    );
    logger.error(error);
    throw err;
  }
}

export async function getNewsFeedEntry(entry: any): Promise<NewsFeedEntry> {
  try {
    const { data: reactionForUser } = await findReactionByUser({
      objectType: ObjectType.UPDATE,
      objectId: entry.item.id,
    });
    const reactionCountResult = await countNumberOfReactions(dbClient, ObjectType.UPDATE, entry.item.id);
    const { data: followedByUser } = await isProjectFollowedByUser({ projectId: entry.item.projectId });

    const reactionCount = reactionCountResult.map((r) => ({
      count: r._count.shortCode,
      emoji: {
        shortCode: r.shortCode,
        nativeSymbol: r.nativeSymbol,
      },
    }));

    return {
      ...entry,
      item: {
        ...entry.item,
        reactionForUser: reactionForUser ? mapReaction(reactionForUser) : undefined,
        followedByUser,
        reactionCount,
      },
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting news feed entry for update with id: ${entry.item.id}`,
      err as Error,
      entry.item.id,
    );
    logger.error(error);
    throw err;
  }
}

export const findReactionByUser = withAuth(
  async (user: UserSession, body: { objectType: ObjectType; objectId: string }) => {
    try {
      const result = await findReaction(dbClient, user.providerId, body.objectType, body.objectId);
      return {
        status: StatusCodes.OK,
        data: result,
      };
    } catch (err) {
      const error: InnoPlatformError = strapiError(
        `Find reaction for ${user.providerId} and ${body.objectType} ${body.objectId} `,
        err as RequestError,
        body.objectId,
      );
      logger.error(error);
      throw err;
    }
  },
);

export const countUpdatesForProject = async (body: { projectId: string }) => {
  try {
    const validatedParams = validateParams(handleProjectUpdatesSchema, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
      };
    }

    const response = await strapiGraphQLFetcher(GetUpdateCountQuery, { projectId: body.projectId });
    const countResult = response.updates_connection?.pageInfo.total ?? 0;

    return { status: StatusCodes.OK, data: countResult };
  } catch (err) {
    const error = strapiError('Getting count of updates', err as RequestError);
    logger.error(error);
    throw err;
  }
};

export async function getProjectUpdatesStartingFrom({ from, page, pageSize }: StartPagination) {
  try {
    const response = await strapiGraphQLFetcher(GetUpdatesStartingFromQuery, { from, page, pageSize });
    const updates = await mapToProjectUpdates(response.updates);

    const newsComments = await getCommentsStartingFrom(dbClient, from, ObjectType.UPDATE);
    // Get unique ids of updates
    const updatesIds = getUniqueValues(
      newsComments.map((comment) => comment?.objectId).filter((id): id is string => id !== undefined),
    );

    if (updatesIds.length > 0) {
      const res = await strapiGraphQLFetcher(GetUpdatesByIdsQuery, { ids: updatesIds });
      const updatesWithComments = await mapToProjectUpdates(res.updates);

      const combinedUpdates = [...updates, ...updatesWithComments];
      const uniqueUpdates = combinedUpdates.filter(
        (update, index, self) => index === self.findIndex((t) => t.id === update.id),
      );
      return uniqueUpdates;
    }

    return updates;
  } catch (err) {
    const error = strapiError(`Getting updates on news comments starting from ${from}`, err as RequestError);
    logger.error(error);
  }
}

export async function getCommentsForProjectUpdateStartingFrom({ from, page, pageSize }: StartPagination) {
  try {
    const response = await strapiGraphQLFetcher(GetUpdatesStartingFromQuery, { from, page, pageSize });
    const updates = mapToProjectUpdates(response.updates);
    return updates;
  } catch (err) {
    const error = strapiError('Getting updates', err as RequestError);
    logger.error(error);
  }
}
