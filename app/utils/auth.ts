import { getServerSession } from 'next-auth';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { options } from '@/pages/api/auth/[...nextauth]';

import { createInnoUserIfNotExist } from './requests';

export interface AuthResponse<TArgs> {
  status: StatusCodes;
  data?: TArgs;
  errors?: any;
}

export function withAuth<TArgs, TReturn>(func: (user: UserSession, body: TArgs) => Promise<AuthResponse<TReturn>>) {
  return async function (args: TArgs) {
    const session = await getServerSession(options);
    if (session == undefined) {
      return { status: StatusCodes.UNAUTHORIZED, errors: 'User is not authenticated' };
    }
    const sessionUser = session?.user as UserSession;
    if (sessionUser) {
      await createInnoUserIfNotExist(sessionUser, sessionUser.image);
      return func(sessionUser, args) as Promise<AuthResponse<TReturn>>;
    }
    return { status: StatusCodes.UNAUTHORIZED, errors: 'User is not authenticated' };
  };
}
