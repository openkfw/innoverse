import { getServerSession } from 'next-auth';
import { StatusCodes } from 'http-status-codes';

import { UserSession } from '@/common/types';
import { options } from '@/pages/api/auth/[...nextauth]';

export interface AuthResponse {
  status: StatusCodes;
  data?: any;
  errors?: any;
}

export function withAuth(func: (user: UserSession, body: any) => Promise<AuthResponse>) {
  return async function (args: any) {
    const session = await getServerSession(options);
    if (session == undefined) {
      return {
        status: StatusCodes.UNAUTHORIZED,
        errors: new Error('User is not authenticated'),
      };
    }
    return func(session?.user, args) as Promise<AuthResponse>;
  };
}
