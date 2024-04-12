'use server';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { addReaction, removeReaction } from '@/repository/db/reaction';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import { Emoji } from './emojiReactionTypes';
import { reactionShemaForEvent, reactionShemaForUpdate } from './validationSchema';

const logger = getLogger();

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
        await removeReaction(dbClient, user.providerId, 'UPDATE', body.updateId);
        return { status: StatusCodes.OK };
      }

      const resultCreateUserReaction = await addReaction(
        dbClient,
        user.providerId,
        'UPDATE',
        body.updateId,
        body.emoji.shortCode,
        body.emoji.nativeSymbol,
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
      await removeReaction(dbClient, user.providerId, 'EVENT', body.eventId);
      return { status: StatusCodes.OK };
    }

    const resultCreateReaction = await addReaction(
      dbClient,
      user.providerId,
      'EVENT',
      body.eventId,
      body.emoji.shortCode,
      body.emoji.nativeSymbol,
    );
    return { status: StatusCodes.OK, data: resultCreateReaction };
  },
);
