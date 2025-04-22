'use server';

import { StatusCodes } from 'http-status-codes';

import { Comment, ObjectType, StartPagination, UserSession } from '@/common/types';
import { getCommentsSchema } from '@/components/project-details/comments/validationSchema';
import { RequestError } from '@/entities/error';
import { getCommentsByObjectIdAndType, isCommentLikedBy } from '@/repository/db/comment';
import { getProjectFollowers, isProjectFollowedBy } from '@/repository/db/follow';
import { getProjectLikes, isObjectLikedBy } from '@/repository/db/like';
import dbClient from '@/repository/db/prisma/prisma';
import { getReactionsForEntity } from '@/repository/db/reaction';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError, strapiError } from '@/utils/errors';
import { getPromiseResults } from '@/utils/helpers';
import getLogger from '@/utils/logger';
import { mapFollow } from '@/utils/newsFeed/redis/redisMappings';
import { getCollaborationQuestionsByProjectId } from '@/utils/requests/collaborationQuestions/requests';
import { getEventsWithAdditionalData, getProjectEventsPage } from '@/utils/requests/events/requests';
import { getOpportunitiesByProjectId } from '@/utils/requests/opportunities/requests';
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
import { getProjectQuestionsByProjectId } from '@/utils/requests/questions/requests';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { getSurveyQuestionsByProjectId } from '@/utils/requests/surveyQuestions/requests';
import { getUpdatesByProjectId } from '@/utils/requests/updates/requests';
import { validateParams } from '@/utils/validationHelper';

import { mapToComment } from '../comments/mapping';
import { getCommentsByObjectId } from '../comments/requests';

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
    const { data: comments } = await getCommentsByObjectId({ objectId: id, objectType: ObjectType.PROJECT });
    const likes = await getProjectLikes(dbClient, id);
    const followers = await getProjectFollowers(dbClient, id);
    const { data: isLiked } = await isProjectLikedByUser({ projectId: id });
    const { data: isFollowed } = await isProjectFollowedByUser({ projectId: id });
    const futureEvents = (await getProjectEventsPage(id, 2, 1, 'future')) || [];
    const pastEvents = (await getProjectEventsPage(id, 2, 1, 'past')) || [];

    const updatesWithAdditionalData = (await getUpdatesByProjectId(id)) ?? [];
    const opportunities = (await getOpportunitiesByProjectId(projectData.documentId)) ?? [];
    const questions = (await getProjectQuestionsByProjectId(projectData.documentId)) ?? [];
    const surveyQuestions = (await getSurveyQuestionsByProjectId(projectData.documentId)) ?? [];
    const collaborationQuestions = (await getCollaborationQuestionsByProjectId(projectData.documentId)) ?? [];

    const futureEventsWithAdditionalData = await getEventsWithAdditionalData(futureEvents);
    const pastEventsWithAdditionalData = await getEventsWithAdditionalData(pastEvents);

    const project = mapToProject({
      projectBaseData: projectData,
      opportunities,
      questions,
      surveyQuestions,
      collaborationQuestions,
      comments: comments ?? [],
      followers: followers.map(mapFollow),
      likes: mapToLike(likes),
      isLiked: isLiked ?? false,
      isFollowed: isFollowed ?? false,
      updates: updatesWithAdditionalData,
      futureEvents: futureEventsWithAdditionalData,
      pastEvents: pastEventsWithAdditionalData,
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

export const getProjectCommentsWithResponses = async (body: { projectId: string }) => {
  try {
    const validatedParams = validateParams(getCommentsSchema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const dbComments = await getCommentsByObjectIdAndType(dbClient, body.projectId, ObjectType.PROJECT, 'asc');
      const comments = await Promise.all(dbComments.map((comment) => mapToComment(comment)));

      const getLikes = comments.map(async (comment): Promise<Comment> => {
        const { data: isLikedByUser } = await isProjectCommentLikedByUser({ commentId: comment.id });

        return {
          ...comment,
          isLikedByUser,
        };
      });

      const commentsWithUserLikes = await getPromiseResults(getLikes);

      return {
        status: StatusCodes.OK,
        data: commentsWithUserLikes,
      };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
      message: validatedParams.message,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError('Getting Project Comments', err as Error, body.projectId);
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting Project Comments failed',
    };
  }
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
