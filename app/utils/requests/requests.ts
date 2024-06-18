import { ObjectType, UserSession } from '@/common/types';
import { withAuth } from '../auth';
import getLogger from '../logger';
import { isFollowedBy } from '@/repository/db/follow';
import { StatusCodes } from 'http-status-codes';
import { InnoPlatformError, dbError } from '../errors';
import dbClient from '@/repository/db/prisma/prisma';
import { findReactionByUser } from './updates/requests';
import { findUserSurveyVote, getSurveyVotes } from '@/repository/db/survey_votes';
import { findUserVote } from './surveyQuestions/requests';

const logger = getLogger();

export const isFollowedByUser = withAuth(
  async (user: UserSession, body: { objectType: ObjectType; objectId: string }) => {
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
  },
);

export const findReactedByUser = withAuth(
  async (user: UserSession, body: { objectType: ObjectType; objectId: string }) => {
    try {
      const { data: reactionForUser } = await findReactionByUser({
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
  },
);

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
