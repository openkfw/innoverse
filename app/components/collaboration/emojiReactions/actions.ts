'use server';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import {
  addReaction,
  addUserReactionOnUpdate,
  countNumberOfReactionsOnUpdatePerEmoji,
  findReactionsByUpdate,
  getUpdateAndUserReaction,
  removeReaction,
} from '@/repository/db/reaction';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import logger from '@/utils/logger';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import { Emoji } from './emojiReactionTypes';
import { reactionShema, reactionShemaForUpdate } from './validationSchema';

export const getAllReactionsForUpdate = withAuth(async (user: UserSession, body: { updateId: string }) => {
  try {
    const validatedParams = validateParams(reactionShema, body);
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
    const validatedParams = validateParams(reactionShema, body);
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

export const getCountPerEmojiOnUpdate = withAuth(async (user: UserSession, body: { updateId: string }) => {
  try {
    const validatedParams = validateParams(reactionShema, body);
    if (validatedParams.status === StatusCodes.OK) {
      const result = await countNumberOfReactionsOnUpdatePerEmoji(dbClient, body.updateId);
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

export const handleNewReaction = withAuth(
  async (user: UserSession, body: { updateId: string; operation: string; emoji: Emoji }) => {
    try {
      const validatedParams = validateParams(reactionShemaForUpdate, body);
      if (validatedParams.status === StatusCodes.OK) {
        if (body.operation === 'upsert') {
          await addReaction(dbClient, body.emoji.shortCode, body.emoji.nativeSymbol);

          const resultCreateUserReaction = await addUserReactionOnUpdate(
            dbClient,
            user.providerId,
            body.updateId,
            body.emoji.shortCode,
          );
          return { status: StatusCodes.OK, data: resultCreateUserReaction };
        } else if (body.operation === 'delete') {
          await removeReaction(dbClient, body.updateId, user.providerId);
        } else {
          return {
            status: StatusCodes.BAD_REQUEST,
            errors: 'The operation method is not allowed',
          };
        }
      }
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
      };
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
