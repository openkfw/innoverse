'use server';

import { StatusCodes } from 'http-status-codes';

import { ObjectType, UserSession } from '@/common/types';
import { RequestError } from '@/entities/error';
import { findFollowedObjectIds, isFollowedBy } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { findsReactionsForObjects } from '@/repository/db/reaction';
import { findUserSurveyVote } from '@/repository/db/survey_votes';
import { getPromiseResults, groupBy } from '@/utils/helpers';

import { withAuth } from '../auth';
import { dbError, InnoPlatformError, strapiError } from '../errors';
import getLogger from '../logger';

import { mapToCollaborationQuestions } from './collaborationQuestions/mappings';
import { getCollaborationQuestionsWithAdditionalData } from './collaborationQuestions/requests';
import { mapToEvents } from './events/mappings';
import { getEventsWithAdditionalData } from './events/requests';
import { mapToUser } from './innoUsers/mappings';
import { getInnoUserByProviderId } from './innoUsers/requests';
import { mapToOpportunities } from './opportunities/mappings';
import { getOpportunitiesWithAdditionalData } from './opportunities/requests';
import { mapToBasicProject } from './project/mappings';
import { mapToProjectQuestions } from './questions/mappings';
import { mapToBasicSurveyQuestions } from './surveyQuestions/mappings';
import { getSurveyQuestionsWithAdditionalData } from './surveyQuestions/requests';
import { mapToProjectUpdates } from './updates/mappings';
import { findReactionByUser, getUpdatesWithAdditionalData } from './updates/requests';
import { GetCountsForProject, GetMainPageData, GetProjectData } from './graphqlQueries';
import { GetLatestNewsQuery } from './queries';
import strapiGraphQLFetcher from './strapiGraphQLFetcher';

const logger = getLogger();

interface ItemObject {
  objectType: ObjectType;
  objectId: string;
}

export const getFollowedByForObjects = withAuth(async (user: UserSession, body: { objects: ItemObject[] }) => {
  try {
    const groups = groupBy(body.objects, 'objectType');

    const getFollowedObjects = groups.map(async (group) => {
      const objectIds = group.items.map((item) => item.objectId);
      const followedObjectsIds = await findFollowedObjectIds(dbClient, group.key, objectIds, user.providerId);
      return followedObjectsIds;
    });

    const followedObjectsIds = (await getPromiseResults(getFollowedObjects)).flatMap((ids) => ids);

    return {
      status: StatusCodes.OK,
      data: followedObjectsIds,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Find following for ${user.providerId} and ${body.objects.length} objects`,
      err as Error,
    );
    logger.error(error);
    throw err;
  }
});

export const isFollowedByUser = withAuth(async (user: UserSession, body: ItemObject) => {
  try {
    const isFollowed = await isFollowedBy(dbClient, body.objectType, body.objectId, user.providerId);

    return {
      status: StatusCodes.OK,
      data: isFollowed,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Find following for ${user.providerId} and ${body.objectId} with type ${body.objectType}`,
      err as Error,
      body.objectId,
    );
    logger.error(error);
    throw err;
  }
});

export const getUserReactionsForObjects = withAuth(async (user: UserSession, body: { objects: ItemObject[] }) => {
  try {
    const groups = groupBy(body.objects, 'objectType');

    const getReactions = groups.map(async (group) => {
      const objectIds = group.items.map((item) => item.objectId);
      const reactions = await findsReactionsForObjects(dbClient, user.providerId, group.key, objectIds);
      return reactions;
    });

    const reactions = (await getPromiseResults(getReactions)).flatMap((reactions) => reactions);

    return {
      status: StatusCodes.OK,
      data: reactions,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Find reactions for ${user.providerId} and ${body.objects.length} objects`,
      err as Error,
    );
    logger.error(error);
    throw err;
  }
});

export const findReactedByUser = withAuth(async (user: UserSession, body: ItemObject) => {
  try {
    const reactionForUser = await findReactionByUser({
      objectType: body.objectType,
      objectId: body.objectId,
    });
    return {
      status: StatusCodes.OK,
      data: reactionForUser,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Find reaction for ${user.providerId} and ${body.objectId} with type ${body.objectType}`,
      err as Error,
      body.objectId,
    );
    logger.error(error);
    throw err;
  }
});

export const findSurveyUserVote = withAuth(async (user: UserSession, body: { objectId: string }) => {
  try {
    const userVote = await findUserSurveyVote(dbClient, body.objectId, user.providerId);
    return {
      status: StatusCodes.OK,
      data: userVote,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Find survey question vote for ${user.providerId} and ${body.objectId}`,
      err as Error,
      body.objectId,
    );
    logger.error(error);
    throw err;
  }
});

export const getAuthorOrError = async (user: UserSession) => {
  const author = await getInnoUserByProviderId(user.providerId);
  if (!author) {
    const error = strapiError(`Getting InnoUser by id ${user.providerId}`, {
      info: 'InnoUser does not exist',
    } as RequestError);
    logger.error(error);
    return null;
  }
  return author;
};

export const getProjectData = async (projectId: string) => {
  try {
    const response = await strapiGraphQLFetcher(GetProjectData, { projectId, now: new Date() });
    const [
      collaborationQuestions,
      opportunities,
      surveyQuestions,
      updates,
      futureEvents,
      pastEvents,
      projectQuestions,
    ] = [
      mapToCollaborationQuestions(response.collaborationQuestions),
      mapToOpportunities(response.opportunities),
      mapToBasicSurveyQuestions(response.surveyQuestions),
      mapToProjectUpdates(response.updates),
      mapToEvents(response.futureEvents),
      mapToEvents(response.pastEvents),
      mapToProjectQuestions(response.questions),
    ];

    const [
      surveyQuestionsWithAdditionalData,
      updatesWithAdditionalData,
      futureEventsWithAdditionalData,
      pastEventsWithAdditionalData,
      opportunitiesWithAdditionalData,
      collaborationQuestionsWithAdditionalData,
    ] = await Promise.all([
      getSurveyQuestionsWithAdditionalData(surveyQuestions),
      getUpdatesWithAdditionalData(updates),
      getEventsWithAdditionalData(futureEvents),
      getEventsWithAdditionalData(pastEvents),
      getOpportunitiesWithAdditionalData(opportunities),
      getCollaborationQuestionsWithAdditionalData(collaborationQuestions),
    ]);
    return {
      collaborationQuestions: collaborationQuestionsWithAdditionalData,
      opportunities: opportunitiesWithAdditionalData,
      questions: projectQuestions,
      surveyQuestions: surveyQuestionsWithAdditionalData,
      updates: updatesWithAdditionalData,
      futureEvents: futureEventsWithAdditionalData,
      pastEvents: pastEventsWithAdditionalData,
    };
  } catch (err) {
    const error = strapiError('Getting project data by project id', err as RequestError, projectId);
    logger.error(error);
  }
  return {
    collaborationQuestions: [],
    updates: [],
    opportunities: [],
    questions: [],
    surveyQuestions: [],
    futureEvents: [],
    pastEvents: [],
  };
};

export const getCountsForProject = async (projectId: string) => {
  const response = await strapiGraphQLFetcher(GetCountsForProject, { projectId, now: new Date() });
  return {
    eventCount: response.events_connection?.pageInfo.total ?? 0,
    updateCount: response.updates_connection?.pageInfo.total ?? 0,
    collaborationQuestionCount: response.collaborationQuestions_connection?.pageInfo.total ?? 0,
    opportunityCount: response.opportunities_connection?.pageInfo.total ?? 0,
    surveyQuestionCount: response.surveyQuestions_connection?.pageInfo.total ?? 0,
  };
};

export const getMainData = async () => {
  const response = await strapiGraphQLFetcher(GetMainPageData, { now: new Date(), updatesLimit: 10 });

  const futureEvents = mapToEvents(response.futureEvents);
  const futureEventsWithAdditionalData = await getEventsWithAdditionalData(futureEvents);

  const updates = mapToProjectUpdates(response.updates);
  const updatesWithAdditionalData = await getUpdatesWithAdditionalData(updates);

  const projects = response.projects.map(mapToBasicProject) ?? [];
  const featuredProjects = response.featuredProjects.map(mapToBasicProject) ?? [];

  return {
    futureEvents: futureEventsWithAdditionalData,
    updates: updatesWithAdditionalData,
    projects,
    featuredProjects,
  };
};
const addType = <T, R extends string>(data: T[], newsType: R) => data.map((item) => ({ ...item, newsType }));

export const getLatestNews = async (after: Date, limit = 5) => {
  const { updates, events, surveyQuestions, collaborationQuestions } = await strapiGraphQLFetcher(GetLatestNewsQuery, {
    after,
    limit,
  });

  const news = [
    ...addType(updates, 'update'),
    ...addType(events, 'event'),
    ...addType(surveyQuestions, 'surveyQuestion'),
    ...addType(collaborationQuestions, 'collaborationQuestion'),
  ].sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime());

  const reactions = await dbClient.reaction.groupBy({
    by: ['objectId', 'nativeSymbol'],
    _count: {
      nativeSymbol: true,
    },
    where: {
      objectType: {
        in: [ObjectType.UPDATE, ObjectType.SURVEY_QUESTION, ObjectType.COLLABORATION_QUESTION, ObjectType.EVENT],
      },
      objectId: {
        in: news.map(({ documentId }) => documentId),
      },
    },
  });

  const reactionsById = reactions.reduce<Record<string, { emoji: string; count: number }[]>>(
    (acc, { objectId, nativeSymbol, _count }) => {
      acc[objectId] ??= [];
      acc[objectId].push({ emoji: nativeSymbol, count: _count.nativeSymbol });
      return acc;
    },
    {},
  );

  return news.map((item) => ({
    ...item,
    reactions: reactionsById[item.documentId] ?? [],
    author: 'author' in item && !!item.author && mapToUser(item.author),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
  }));
};
