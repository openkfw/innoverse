import { getServerSession } from 'next-auth';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { options } from '@/pages/api/auth/[...nextauth]';

import { createInnoUserIfNotExist } from './requests';
import logger from './logger';

export interface AuthResponse<TArgs> {
  status: StatusCodes;
  data?: TArgs;
  errors?: any;
  message?: any;
}

export function withAuth<TArgs, TReturn>(func: (user: UserSession, body: TArgs) => Promise<AuthResponse<TReturn>>) {
  return async function (args: TArgs) {
    const session = await getServerSession(options);
    if (!session || !session.user) {
      return {
        status: StatusCodes.UNAUTHORIZED,
        errors: 'User is not authenticated',
        message: 'User is not authenticated',
      };
    }
    const sessionUser = session?.user as UserSession;
    await createInnoUserIfNotExist(sessionUser, sessionUser.image);
    try {
      return func(sessionUser, args) as Promise<AuthResponse<TReturn>>;
    } catch (err) {
      logger.error(err);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Performing request failed',
      };
    }
  };
}
