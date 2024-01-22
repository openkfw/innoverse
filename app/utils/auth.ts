import { getServerSession } from 'next-auth';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { options } from '@/pages/api/auth/[...nextauth]';

import { createInnoUserIfNotExist } from './requests';

export interface AuthResponse {
  status: StatusCodes;
  data?: any;
  errors?: any;
}

export function withAuth(func: (user: UserSession, body: any) => Promise<AuthResponse>) {
  return async function (args: any) {
    const session = await getServerSession(options);
    if (session == undefined) {
      return { status: StatusCodes.UNAUTHORIZED, errors: 'User is not authenticated' };
    }
    const sessionUser = session?.user as UserSession;
    await createInnoUserIfNotExist(sessionUser, sessionUser.image);
    return func(sessionUser, args) as Promise<AuthResponse>;
  };
}
