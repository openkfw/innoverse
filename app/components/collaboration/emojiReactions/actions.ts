'use server';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import {
  addReaction,
  addUserReactionOnEvent,
  addUserReactionOnUpdate,
  countNumberOfReactionsOnEventPerEmoji,
  countNumberOfReactionsOnUpdatePerEmoji,
  findReactionsByUpdate,
  getEventAndUserReaction,
  getReactionsByShortCodes,
  getUpdateAndUserReaction,
  removeUserReactionOnEvent,
  removeUserReactionOnUpdate,
} from '@/repository/db/reaction';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import logger from '@/utils/logger';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import { Emoji } from './emojiReactionTypes';
import {
  eventReactionShema,
  reactionShemaForEvent,
  reactionShemaForUpdate,
  updateReactionShema,
} from './validationSchema';

export const getAllReactionsForUpdate = withAuth(async (user: UserSession, body: { updateId: string }) => {
  try {
    const validatedParams = validateParams(updateReactionShema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const result = await findReactionsByUpdate(dbClient, body.updateId);
      return { status: StatusCodes.OK, data: result };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting all reactions from update ${body.updateId}`,
      err as Error,
      body.updateId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting reactions failed',
    };
  }
});

export const getReactionForUpdateAndUser = withAuth(async (user: UserSession, body: { updateId: string }) => {
  try {
    const validatedParams = validateParams(updateReactionShema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const result = await getUpdateAndUserReaction(dbClient, body.updateId, user.providerId);
      return { status: StatusCodes.OK, data: result };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting all reactions from update ${body.updateId} and user ${user.providerId}`,
      err as Error,
      body.updateId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting reactions failed',
    };
  }
});

export const getReactionForEventAndUser = withAuth(async (user: UserSession, body: { eventId: string }) => {
  const validatedParams = validateParams(eventReactionShema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await getEventAndUserReaction(dbClient, body.eventId, user.providerId);
    return { status: StatusCodes.OK, data: result };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const getEmojisByShortCodes = withAuth(async (user: UserSession, body: { shortCodes: string[] }) => {
  const result = await getReactionsByShortCodes(dbClient, body.shortCodes);
  return {
    status: StatusCodes.OK,
    data: result as Emoji[],
  };
});

export const getCountPerEmojiOnUpdate = withAuth(async (user: UserSession, body: { updateId: string }) => {
  try {
    const validatedParams = validateParams(updateReactionShema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const reactionCount = await countNumberOfReactionsOnUpdatePerEmoji(dbClient, body.updateId);
      const result = reactionCount.map((reactionCount) => ({
        shortCode: reactionCount.reactionShortCode,
        count: reactionCount._count.reactionShortCode,
      }));
      return { status: StatusCodes.OK, data: result };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting emoji count for update ${body.updateId}`,
      err as Error,
      body.updateId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting reaction count failed',
    };
  }
});

export const getCountPerEmojiOnEvent = withAuth(async (user: UserSession, body: { eventId: string }) => {
  try {
    const validatedParams = validateParams(eventReactionShema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const reactionCount = await countNumberOfReactionsOnEventPerEmoji(dbClient, body.eventId);
      const result = reactionCount.map((reactionCount) => ({
        shortCode: reactionCount.reactionShortCode,
        count: reactionCount._count.reactionShortCode,
      }));
      return { status: StatusCodes.OK, data: result };
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  } catch (err) {
    const error: InnoPlatformError = dbError(
      `Getting emoji count for event ${body.eventId}`,
      err as Error,
      body.eventId,
    );
    logger.error(error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Getting reaction count failed',
    };
  }
});

export const handleNewReactionOnUpdate = withAuth(
  async (user: UserSession, body: { updateId: string; operation: 'upsert' | 'delete'; emoji: Emoji }) => {
    try {
      const validatedParams = validateParams(reactionShemaForUpdate, body);

      if (validatedParams.status !== StatusCodes.OK) {
        return {
          status: validatedParams.status,
          errors: validatedParams.errors,
        };
      }

      if (body.operation === 'delete') {
        await removeUserReactionOnUpdate(dbClient, body.updateId, user.providerId);
        return { status: StatusCodes.OK };
      }

      await addReaction(dbClient, body.emoji.shortCode, body.emoji.nativeSymbol);
      const resultCreateUserReaction = await addUserReactionOnUpdate(
        dbClient,
        user.providerId,
        body.updateId,
        body.emoji.shortCode,
      );
      return { status: StatusCodes.OK, data: resultCreateUserReaction };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Handling emoji reaction ${body.operation} for update ${body.updateId} and user ${user.providerId}`,
        err as Error,
        body.updateId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Updating emoji reaction failed',
      };
    }
  },
);

export const handleNewReactionOnEvent = withAuth(
  async (user: UserSession, body: { eventId: string; operation: 'upsert' | 'delete'; emoji: Emoji }) => {
    const validatedParams = validateParams(reactionShemaForEvent, body);

    if (validatedParams.status !== StatusCodes.OK) {
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
      };
    }

    if (body.operation === 'delete') {
      await removeUserReactionOnEvent(dbClient, body.eventId, user.providerId);
      return { status: StatusCodes.OK };
    }

    await addReaction(dbClient, body.emoji.shortCode, body.emoji.nativeSymbol);
    const resultCreateUserReaction = await addUserReactionOnEvent(
      dbClient,
      user.providerId,
      body.eventId,
      body.emoji.shortCode,
    );
    return { status: StatusCodes.OK, data: resultCreateUserReaction };
  },
);
