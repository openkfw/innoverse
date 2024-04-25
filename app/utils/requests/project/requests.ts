'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { getProjectComments } from '@/components/project-details/comments/actions';
import { getProjectFollowers, isProjectFollowedBy } from '@/repository/db/follow';
import { getProjectLikes, isProjectLikedBy } from '@/repository/db/like';
import dbClient from '@/repository/db/prisma/prisma';
import { isCommentUpvotedBy } from '@/repository/db/project_comment';
import { getCollaborationQuestionsByProjectId } from '@/utils/requests/collaborationQuestions/requests';
import { getEventsWithAdditionalData, getProjectEventsPage } from '@/utils/requests/events/requests';
import { getOpportunitiesByProjectId } from '@/utils/requests/opportunities/requests';
import { mapToBasicProject, mapToProject } from '@/utils/requests/project/mappings';
import { GetProjectByIdQuery, GetProjectsQuery } from '@/utils/requests/project/queries';
import { getProjectQuestionsByProjectId } from '@/utils/requests/questions/requests';
import strapiGraphQLFetcher from '@/utils/requests/strapiGraphQLFetcher';
import { getSurveyQuestionsByProjectId } from '@/utils/requests/surveyQuestions/requests';
import { getUpdatesByProjectId } from '@/utils/requests/updates/requests';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError, strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';

const logger = getLogger();

export async function getProjectById(id: string) {
  try {
    const response = await strapiGraphQLFetcher(GetProjectByIdQuery, { id });
    const projectData = response.project?.data;

    if (!projectData) throw 'Response contained no project data';

    const projectComments = await getProjectComments({ projectId: projectData.id });

    if (!projectComments.data) throw 'Failed to load project comments for project';

    const likes = await getProjectLikes(dbClient, id);
    const followers = await getProjectFollowers(dbClient, id);
    const { data: isLiked } = await isProjectLikedByUser({ projectId: id });
    const { data: isFollowed } = await isProjectFollowedByUser({ projectId: id });
    const futureEvents = (await getProjectEventsPage(id, 2, 1, 'future')) || [];
    const pastEvents = (await getProjectEventsPage(id, 2, 1, 'past')) || [];

    const comments = projectComments.data;
    const updates = (await getUpdatesByProjectId(id)) ?? [];
    const opportunities = (await getOpportunitiesByProjectId(projectData.id)) ?? [];
    const questions = (await getProjectQuestionsByProjectId(projectData.id)) ?? [];
    const surveyQuestions = (await getSurveyQuestionsByProjectId(projectData.id)) ?? [];
    const collaborationQuestions = (await getCollaborationQuestionsByProjectId(projectData.id)) ?? [];

    const futureEventsWithAdditionalData = await getEventsWithAdditionalData(futureEvents);
    const pastEventsWithAdditionalData = await getEventsWithAdditionalData(pastEvents);

    const project = await mapToProject({
      projectBaseData: projectData,
      opportunities,
      questions,
      surveyQuestions,
      collaborationQuestions,
      comments,
      updates,
      followers,
      likes,
      isLiked: isLiked ?? false,
      isFollowed: isFollowed ?? false,
      futureEvents: futureEventsWithAdditionalData,
      pastEvents: pastEventsWithAdditionalData,
    });

    return project;
  } catch (err) {
    const e: InnoPlatformError = strapiError('Getting Project by ID', err as Error, id);
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
    const projects = response.projects?.data.map(mapToBasicProject) ?? [];
    return projects;
  } catch (err) {
    console.info(err);
  }
}

export const isProjectLikedByUser = withAuth(async (user: UserSession, body: { projectId: string }) => {
  try {
    const isLiked = await isProjectLikedBy(dbClient, body.projectId, user.providerId);
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

export const isProjectCommentUpvotedByUser = withAuth(async (user: UserSession, body: { commentId: string }) => {
  try {
    const isUpvoted = await isCommentUpvotedBy(dbClient, body.commentId, user.providerId);
    return { status: StatusCodes.OK, data: isUpvoted };
  } catch (err) {
    const error: InnoPlatformError = strapiError(
      `Find upvote for comment${body.commentId} by user ${user.providerId}`,
      err as Error,
      body.commentId,
    );
    logger.error(error);
    throw err;
  }
});
