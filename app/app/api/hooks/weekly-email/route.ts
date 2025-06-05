import { headers } from 'next/headers';
import { after } from 'next/server';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { serverConfig } from '@/config/server';
import { sendWeeklyEmail } from '@/utils/emails/weeklyEmail';

export async function POST() {
  const headersList = await headers();
  const authorization = headersList.get('authorization');

  if (authorization == serverConfig.STRAPI_PUSH_NOTIFICATION_SECRET) {
    after(sendWeeklyEmail);
    return new Response(ReasonPhrases.OK);
  } else {
    return new Response(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
  }
}
