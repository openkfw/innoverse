import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { literal, number, object, string, z } from 'zod';

import { serverConfig } from '@/config/server';
import { onStrapiEvent } from '@/utils/strapiEvents/strapiEventHandler';
import { headers } from 'next/headers';
import getLogger from '@/utils/logger';

const logger = getLogger();

const bodySchema = z.object({
  event: literal('entry.create')
    .or(literal('entry.update'))
    .or(literal('entry.delete'))
    .or(literal('entry.publish'))
    .or(literal('entry.unpublish')),
  model: string(),
  entry: object({ id: string().or(number()) }),
});

//For information about how the rules work & the challenges head to: ***URL_REMOVED***
export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    if (authorization !== serverConfig.STRAPI_PUSH_NOTIFICATION_SECRET) {
      return new Response(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const body = await request.json();
    const { event, model, entry } = bodySchema.parse(body);
    await onStrapiEvent(event, model, entry);
    return new Response(ReasonPhrases.OK);
  } catch (error) {
    logger.error('Strapi push webhook:', error);
    return new Response(ReasonPhrases.INTERNAL_SERVER_ERROR, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}
