'use server';

import { StatusCodes } from 'http-status-codes';

import { ObjectType, StartPagination, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { isCommentLikedBy } from '@/repository/db/comment';
import { getProjectFollowers, isProjectFollowedBy } from '@/repository/db/follow';
import { getProjectLikes, isObjectLikedBy } from '@/repository/db/like';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError, strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapFollow } from '@/utils/newsFeed/redis/redisMappings';
import { mapToBasicProject, mapToLike, mapToProject, mapToProjects } from '@/utils/requests/project/mappings';
import {
  GetProjectAuthorIdByProjectIdQuery,
  GetProjectByIdQuery,
  GetProjectsBySearchStringQuery,
  GetProjectsQuery,
  GetProjectsStartingFromQuery,
  GetProjectTitleByIdQuery,
  GetProjectTitleByIdsQuery,
} from '@/utils/requests/project/queries';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';

import { getProjectData } from '../requests';

const logger = getLogger();

export async function getProjectTitleById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetProjectTitleByIdQuery, { id });
    const title = response.project?.title;
    if (title === undefined) {
      throw new Error('Response contained no title');
    }
    return title as string;
  } catch (err) {
    const e: InnoPlatformError = strapiError('Getting Project title by ID', err as RequestError, id);
    logger.error(e);
  }
}

export async function getProjectTitleByIds(ids: string[], page: number, pageSize: number) {
  try {
    const response = await strapiGraphQLFetcher(GetProjectTitleByIdsQuery, { ids, page, pageSize });
    if (!response.projects) throw 'Response contained no project data';
    const projectTitles = response.projects.map((project) => ({
      id: project?.documentId,
      title: project?.title as string,
    }));
    return projectTitles;
  } catch (err) {
    const e: InnoPlatformError = strapiError('Getting Project titles by ID list', err as RequestError);
    logger.error(e);
  }
}

export async function getProjectById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetProjectByIdQuery, { id });
    const projectData = response.project;
    if (!projectData) throw new Error('Response contained no project data');

    const likes = await getProjectLikes(dbClient, id);
    const followers = await getProjectFollowers(dbClient, id);
    const { data: isLiked } = await isProjectLikedByUser({ projectId: id });
    const { data: isFollowed } = await isProjectFollowedByUser({ projectId: id });

    const projectStrapiData = await getProjectData(projectData.documentId);
    const project = mapToProject({
      projectBaseData: projectData,
      ...projectStrapiData,
      followers: followers.map(mapFollow),
      likes: mapToLike(likes),
      isLiked: isLiked ?? false,
      isFollowed: isFollowed ?? false,
      comments: [],
    });

    return project;
  } catch (err) {
    const e: InnoPlatformError = strapiError('Getting Project by ID', err as RequestError, id);
    logger.error(e);
  }
}

export async function getProjects(
  {
    limit,
    sort,
  }: {
    limit: number;
    sort: { by: 'updatedAt' | 'title'; order: 'asc' | 'desc' };
  } = { limit: 80, sort: { by: 'updatedAt', order: 'desc' } },
) {
  try {
    const response = await strapiGraphQLFetcher(GetProjectsQuery, { limit, sort: `${sort.by}:${sort.order}` });
    const projects = response.projects?.map(mapToBasicProject) ?? [];
    return projects;
  } catch (err) {
    console.info(err);
  }
}

export async function getProjectsBySearchString(
  {
    sort,
    searchString,
    pagination,
  }: {
    sort: { by: 'updatedAt' | 'title'; order: 'asc' | 'desc' };
    searchString: string;
    pagination: {
      page: number;
      pageSize?: number;
    };
  } = { pagination: { pageSize: 80, page: 1 }, sort: { by: 'updatedAt', order: 'desc' }, searchString: '' },
) {
  try {
    const response = await strapiGraphQLFetcher(GetProjectsBySearchStringQuery, {
      page: pagination.page,
      pageSize: pagination?.pageSize,
      sort: `${sort.by}:${sort.order}`,
      searchString,
    });
    const projects = response.projects?.map(mapToBasicProject) ?? [];
    return projects;
  } catch (err) {
    console.info(err);
  }
}

export async function getProjectAuthorIdByProjectId(projectId: string) {
  try {
    const response = await strapiGraphQLFetcher(GetProjectAuthorIdByProjectIdQuery, { projectId });
    const projectData = response.project;
    const authorData = projectData?.author;

    if (!projectData) throw new Error('Response contained no project data');

    return { authorId: authorData?.documentId };
  } catch (err) {
    const error = strapiError('Getting project author by project id', err as RequestError, projectId);
    logger.error(error);
  }
}

export const isProjectLikedByUser = withAuth(async (user: UserSession, body: { projectId: string }) => {
  try {
    const isLiked = await isObjectLikedBy(dbClient, body.projectId, user.providerId);
    return {
      status: StatusCodes.OK,
      data: isLiked,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Check if user with id ${user.providerId} has liked project with id ${body.projectId}`,
      err as Error,
      body.projectId,
    );
    logger.error(error);
    throw err;
  }
});

export const isProjectFollowedByUser = withAuth(async (user: UserSession, body: { projectId: string }) => {
  try {
    const isFollowed = await isProjectFollowedBy(dbClient, body.projectId, user.providerId);

    return {
      status: StatusCodes.OK,
      data: isFollowed,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Find following for ${user.providerId} and ${body.projectId}`,
      err as Error,
      body.projectId,
    );
    logger.error(error);
    throw err;
  }
});

export const isProjectCommentLikedByUser = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const isLiked = await isCommentLikedBy(dbClient, body.commentId, user.providerId);
    return { status: StatusCodes.OK, data: isLiked };
  } catch (err) {
    const error: InnoPlatformError = strapiError(
      `Find like for comment${body.commentId} by user ${user.providerId}`,
      err as RequestError,
      body.commentId,
    );
    logger.error(error);
    throw err;
  }
});

export const getProjectsOptions = async () => {
  const projects = (await getProjects({ limit: 100, sort: { by: 'title', order: 'asc' } })) ?? [];
  return projects.map((project) => {
    return {
      id: project.id,
      label: project.title,
    };
  });
};

export async function getProjectByIdWithReactions(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetProjectByIdQuery, { id });
    if (!response.project) throw new Error('Response contained no project');
    const project = mapToBasicProject(response.project);
    const reactions = await getReactionsForEntity(dbClient, ObjectType.PROJECT, project.id);
    return { ...project, reactions };
  } catch (err) {
    const error = strapiError('Getting project', err as RequestError);
    logger.error(error);
  }
}

export async function getProjectsStartingFrom({ from, page, pageSize }: StartPagination) {
  try {
    const response = await strapiGraphQLFetcher(GetProjectsStartingFromQuery, { from, page, pageSize });
    if (!response.projects) throw new Error('Response contained no projects');
    const projects = mapToProjects(response.projects);
    return projects;
  } catch (err) {
    const error = strapiError('Getting upcoming projects', err as RequestError);
    logger.error(error);
  }
}
