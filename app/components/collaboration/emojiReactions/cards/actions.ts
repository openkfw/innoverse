'use server';
import { StatusCodes } from 'http-status-codes';

import { ObjectType, UserSession } from '@/common/types';
import { addReaction, removeReaction } from '@/services/reactionService';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { validateParams } from '@/utils/validationHelper';

import { Emoji } from '../emojiReactionTypes';

import { reactionSchema } from './validationSchema';

const logger = getLogger();

export const handleReaction = withAuth(
  async (
    user: UserSession,
    body: { objectId: string; objectType: ObjectType; operation: 'upsert' | 'delete'; emoji: Emoji },
  ) => {
    try {
      const validatedParams = validateParams(reactionSchema, body);

      if (validatedParams.status !== StatusCodes.OK) {
        return {
          status: validatedParams.status,
          errors: validatedParams.errors,
        };
      }

      if (body.operation === 'delete') {
        const removedReaction = await removeReaction({
          reaction: { reactedBy: user.providerId, objectType: body.objectType, objectId: body.objectId },
          user,
        });
        return { status: StatusCodes.OK, data: removedReaction };
      }

      const reaction = await addReaction({
        reaction: {
          reactedBy: user.providerId,
          objectType: body.objectType,
          objectId: body.objectId,
          shortCode: body.emoji.shortCode,
          nativeSymbol: body.emoji.nativeSymbol,
        },
        user,
      });

      return { status: StatusCodes.OK, data: reaction };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Handling emoji reaction ${body.operation} for object with id ${body.objectId} (Type: ${body.objectType}, User id: ${user.providerId})`,
        err as Error,
        body.objectId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Updating emoji reaction failed',
      };
    }
  },
);
