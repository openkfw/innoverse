'use server';

import { StatusCodes } from 'http-status-codes';

import { ObjectType, UserSession } from '@/common/types';
import { findFollowedObjectIds, isFollowedBy } from '@/repository/db/follow';
import dbClient from '@/repository/db/prisma/prisma';
import { findsReactionsForObjects } from '@/repository/db/reaction';
import { findUserSurveyVote } from '@/repository/db/survey_votes';
import { getPromiseResults, groupBy } from '@/utils/helpers';

import { withAuth } from '../auth';
import { dbError, InnoPlatformError } from '../errors';
import getLogger from '../logger';

import { findReactionByUser } from './updates/requests';
import strapiGraphQLFetcher from './strapiGraphQLFetcher';
import { GetLatestNewsQuery } from './queries';
import { mapToUser } from './innoUsers/mappings';

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

const addType = <T, R extends string>(data: T[], newsType: R) => data.map((item) => ({ ...item, newsType }));

export const getLatestNews = async (after: Date, limit = 5) => {
  const { updates, events, surveyQuestions, collaborationQuestions } = await strapiGraphQLFetcher(GetLatestNewsQuery, {
    after,
    limit,
  });
  // const comments = await getCommentsStartingFrom(
  //   dbClient,
  //   after,
  //   ObjectType.PROJECT,
  //   ObjectType.COLLABORATION_QUESTION,
  // );
  // const collaborationComments = comments.map(({ objectId, ...rest }) => ({
  //   ...rest,
  //   project: { documentId: objectId },
  // }));

  const news = [
    // ...addType(collaborationComments, 'collaborationComment'),
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
