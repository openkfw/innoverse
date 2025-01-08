import type { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { RequestError } from '@/entities/error';
import { InnoPlatformError, strapiError } from '@/utils/errors';
import getLogger from '@/utils/logger';
import { generateUniqueUsername, getAllInnoUsers, updateInnoUserUsername } from '@/utils/requests/innoUsers/requests';

const logger = getLogger();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;
    if (method !== 'GET') return res.status(StatusCodes.METHOD_NOT_ALLOWED);
    res.setHeader('Cache-Control', 'no-store');
    const users = await getAllInnoUsers();
    users.map(async (user) => {
      if (!user.attributes.username) {
        const username = await generateUniqueUsername(user.attributes.email as string);
        const response = await updateInnoUserUsername(user.id!, username);
        if (response) {
          logger.debug(`Username for Inno User with id ${user.id} was updated`);
        }
      }
    });
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    logger.debug('Usernames for all Inno Users were updated.');
  } catch (err) {
    const error: InnoPlatformError = strapiError(`Error when updating usernames`, err as RequestError);
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}
