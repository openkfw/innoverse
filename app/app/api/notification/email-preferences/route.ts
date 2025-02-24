import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { decode } from 'next-auth/jwt';

import { serverConfig } from '@/config/server';
import { updateEmailPreferencesForUser } from '@/repository/db/email_preferences';
import dbClient from '@/repository/db/prisma/prisma';
import { dbError, InnoPlatformError } from '@/utils/errors';
import getLogger from '@/utils/logger';

const logger = getLogger();

function verifyAudience(aud: unknown, request: Request): boolean {
  const { origin, pathname } = new URL(request.url);
  return aud === origin + pathname;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token') ?? '';
    const secret = serverConfig.NEXTAUTH_SECRET;

    const payload = await decode({ token, secret });

    if (!payload || !payload.sub || !verifyAudience(payload.aud, request)) {
      throw new Error('Invalid token');
    }

    await updateEmailPreferencesForUser(dbClient, payload.sub, {
      weekly: false,
    });
  } catch (err) {
    if (err instanceof Error) {
      const error: InnoPlatformError = dbError(`Update email notification preferences failed: ${err.message}`, err);
      logger.error(error);
    }

    redirect('/profile?emailPreferencesChanged=false');
  }

  redirect('/profile?emailPreferencesChanged=true');
}
