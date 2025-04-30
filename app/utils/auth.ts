import { getServerSession } from 'next-auth';
import { StatusCodes } from 'http-status-codes';

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { UserSession } from '@/common/types';
import { createInnoUserIfNotExist } from '@/utils/requests/innoUsers/requests';

import getLogger from './logger';

export interface AuthResponse<TArgs> {
  status: StatusCodes;
  data?: TArgs;
  errors?: any;
  message?: any;
}

const logger = getLogger();

export function withAuth<TArgs, TReturn>(func: (user: UserSession, body: TArgs) => Promise<AuthResponse<TReturn>>) {
  return async function (args?: TArgs) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        status: StatusCodes.UNAUTHORIZED,
        errors: 'User is not authenticated',
        message: 'User is not authenticated',
      };
    }
    const { image, ...sessionUser } = session.user;

    try {
      await createInnoUserIfNotExist(sessionUser, image);
    } catch (err) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'User could not be created',
      };
    }

    try {
      return func(session.user, args as TArgs) as Promise<AuthResponse<TReturn>>;
    } catch (err) {
      logger.error(err);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Performing request failed',
      };
    }
  };
}
