import { StatusCodes } from 'http-status-codes';
import { ZodType } from 'zod';

import { validationError } from './errors';
import getLogger from './logger';

const logger = getLogger();

export const validateParams = (schema: ZodType, body: any) => {
  const validatedParams = schema.safeParse(body);

  if (!validatedParams.success) {
    const error = validationError(
      'Validating Params',
      new Error(JSON.stringify(validatedParams.error.flatten().fieldErrors)),
    );
    logger.error(error);
    return {
      status: StatusCodes.BAD_REQUEST,
      errors: validatedParams.error.flatten().fieldErrors,
      message: 'Validation failed, bad request',
    };
  }
  return { status: StatusCodes.OK };
};
