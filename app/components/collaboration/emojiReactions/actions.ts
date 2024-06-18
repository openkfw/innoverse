'use server';
import { StatusCodes } from 'http-status-codes';

import { ObjectType, UserSession } from '@/common/types';
import { addReaction, getItemForEntityWithReactions, removeReaction } from '@/services/reactionService';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { mapRedisNewsFeedEntry } from '@/utils/newsFeed/redis/redisMappings';
import { validateParams } from '@/utils/validationHelper';

import { Emoji } from './emojiReactionTypes';
import { basicSchema, reactionSchema } from './validationSchema';

const logger = getLogger();

export const getNewsFeedItemWithReactions = withAuth(
  async (user: UserSession, body: { objectId: string; objectType: ObjectType }) => {
    try {
      const validatedParams = validateParams(basicSchema, body);

      if (validatedParams.status !== StatusCodes.OK) {
        return {
          status: validatedParams.status,
          errors: validatedParams.errors,
        };
      }
      const newsFeedItem = await getItemForEntityWithReactions(
        {
          objectId: body.objectId,
          objectType: body.objectType,
        },
        user,
      );

      if (newsFeedItem) {
        const mappedNewsFeedItem = await mapRedisNewsFeedEntry(newsFeedItem);
        return {
          status: StatusCodes.OK,
          data: mappedNewsFeedItem,
        };
      }
      return { status: StatusCodes.OK };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Getting entity with reactions for type ${body.objectType} with id ${body.objectId} and user ${user.providerId}`,
        err as Error,
        body.objectId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Getting entity with reactions failed',
      };
    }
  },
);

export const handleNewReaction = withAuth(
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
        await removeReaction({
          reaction: { reactedBy: user.providerId, objectType: body.objectType, objectId: body.objectId },
          user,
        });
        return { status: StatusCodes.OK };
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
        `Handling emoji reaction ${body.operation} for type ${body.objectType} with id ${body.objectId} and user ${user.providerId}`,
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
