'use server';

import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { addCheckinVotes } from '@/repository/db/checkin_votes';
import dbClient from '@/repository/db/prisma/prisma';
import { withAuth } from '@/utils/auth';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { validateParams } from '@/utils/validationHelper';

import { handleCheckinSchema } from './validationSchema';

const logger = getLogger();

export const saveDailyCheckin = withAuth(
  async (user: UserSession, body: { dailyCheckinVotes: { vote: number; checkinQuestionId: string }[] }) => {
    try {
      const validatedParams = validateParams(handleCheckinSchema, body);
      if (validatedParams.status === StatusCodes.OK) {
        await addCheckinVotes(
          dbClient,
          body.dailyCheckinVotes.map((vote) => ({
            ...vote,
            votedBy: user.providerId,
          })),
        );
        return {
          status: StatusCodes.OK,
        };
      }
      return {
        status: validatedParams.status,
        errors: validatedParams.errors,
        message: validatedParams.message,
      };
    } catch (err) {
      const error: InnoPlatformError = dbError(
        `Adding vote for the daily checkin questions for user ${user.providerId}`,
        err as Error,
        user.providerId,
      );
      logger.error(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Daily Check-in failed',
      };
    }
  },
);
