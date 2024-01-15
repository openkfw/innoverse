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
import { validateParams } from '@/utils/validationHelper';

import dbClient from '../../../repository/db/prisma/prisma';

import { Emoji } from './emojiReactionTypes';
import { reactionShema, reactionShemaForUpdate } from './validationSchema';

export const getAllReactionsForUpdate = withAuth(async (user: UserSession, body: { updateId: string }) => {
  const validatedParams = validateParams(reactionShema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await findReactionsByUpdate(dbClient, body.updateId);
    return { status: StatusCodes.OK, data: result };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const getReactionForUpdateAndUser = withAuth(async (user: UserSession, body: { updateId: string }) => {
  const validatedParams = validateParams(reactionShema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await getUpdateAndUserReaction(dbClient, body.updateId, user.providerId);
    return { status: StatusCodes.OK, data: result };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const getCountPerEmojiOnUpdate = withAuth(async (user: UserSession, body: { updateId: string }) => {
  const validatedParams = validateParams(reactionShema, body);
  if (validatedParams.status === StatusCodes.OK) {
    const result = await countNumberOfReactionsOnUpdatePerEmoji(dbClient, body.updateId);
    return { status: StatusCodes.OK, data: result };
  }
  return {
    status: validatedParams.status,
    errors: validatedParams.errors,
  };
});

export const handleNewReaction = withAuth(
  async (user: UserSession, body: { updateId: string; operation: string; emoji: Emoji }) => {
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
        ('ERROR in Handling Reaction, actions.ts');
      }
    }
    return {
      status: validatedParams.status,
      errors: validatedParams.errors,
    };
  },
);
