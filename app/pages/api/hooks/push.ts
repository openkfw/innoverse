import type { NextApiRequest, NextApiResponse } from 'next';
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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, headers } = req;
  const { authorization } = headerSchema.parse(headers);
  const { event, model, entry } = bodySchema.parse(body);

  if (method !== 'POST') res.status(StatusCodes.METHOD_NOT_ALLOWED).send(ReasonPhrases.METHOD_NOT_ALLOWED);
  if (authorization !== serverConfig.STRAPI_PUSH_NOTIFICATION_SECRET)
    res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);

  await onStrapiEvent(event, model, entry);
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
}
