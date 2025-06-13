import { headers } from 'next/headers';
import { after } from 'next/server';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { serverConfig } from '@/config/server';
import { sendWeeklyEmail } from '@/utils/emails/weeklyEmail';

export async function POST(request: Request) {
  const headersList = await headers();
  const authorization = headersList.get('authorization');

  if (authorization == serverConfig.STRAPI_PUSH_NOTIFICATION_SECRET) {
    const { event } = await request.json();
    if (event === 'trigger-cron' || process.env.NODE_ENV === 'development') {
      after(sendWeeklyEmail);
      return new Response(ReasonPhrases.OK);
    } else return new Response(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
  } else {
    return new Response(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
  }
}
