import { getServerSession } from 'next-auth';
import { StatusCodes } from 'http-status-codes';

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { UserSession } from '@/common/types';
import { createInnoUserIfNotExist } from '@/utils/requests/innoUsers/requests';

import getLogger from './logger';

export interface AuthResponseSuccess<TReturn> {
  status: StatusCodes.OK;
  data: TReturn;
}

export interface AuthResponseError {
  status: StatusCodes.UNAUTHORIZED | StatusCodes.INTERNAL_SERVER_ERROR | StatusCodes.BAD_REQUEST;
  errors?: any;
  message?: any;
}

export type AuthResponse<TReturn> = AuthResponseSuccess<TReturn> | AuthResponseError;

const logger = getLogger();

export function withAuth<TArgs extends unknown[], TReturn>(
  func: (user: UserSession, ...args: TArgs) => Promise<AuthResponseSuccess<TReturn> | AuthResponseError>,
) {
  return async function (...args: TArgs): Promise<AuthResponseSuccess<TReturn> | AuthResponseError> {
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
      return func(sessionUser, ...args);
    } catch (err) {
      logger.error(err);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Performing request failed',
      };
    }
  };
}
