import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { literal, number, object, string, z } from 'zod';

import { serverConfig } from '@/config/server';
import { onStrapiEvent } from '@/utils/strapiEvents/strapiEventHandler';

// Header parsing. These headers are required for the push notification to work. Additional headers are allowed but ignored.
const headerSchema = z.object({
  authorization: string(),
});

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
export async function POST({ body, headers }: Request) {
  const { authorization } = headerSchema.parse(headers);
  const { event, model, entry } = bodySchema.parse(body);

  if (authorization !== serverConfig.STRAPI_PUSH_NOTIFICATION_SECRET)
    return new Response(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });

  await onStrapiEvent(event, model, entry);
  return new Response(ReasonPhrases.OK);
}
