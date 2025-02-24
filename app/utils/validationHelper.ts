import { StatusCodes } from 'http-status-codes';
import { ZodType } from 'zod';

import { validationError } from './errors';
import getLogger from './logger';

const logger = getLogger();

type ValidationSuccess<T> = {
  status: StatusCodes.OK;
  data: T;
};

type ValidationError<T> = {
  status: StatusCodes.BAD_REQUEST;
  errors: { [P in T extends any ? keyof T : never]?: string[] | undefined };
  message: string;
};

export const validateParams = <T>(schema: ZodType<T>, body: unknown): ValidationSuccess<T> | ValidationError<T> => {
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
  return { status: StatusCodes.OK, data: validatedParams.data };
};

export const validateAndReturn = <T>(
  schema: ZodType,
  body: any,
):
  | { isValid: true; data: T }
  | { isValid: false; response: { status: StatusCodes; errors: any; message?: string } } => {
  const validated = validateParams(schema, body);
  if (validated.status !== StatusCodes.OK) {
    return {
      isValid: false,
      response: {
        status: validated.status,
        errors: validated.errors,
        message: validated.message,
      },
    };
  }
  return { isValid: true, data: validated.data };
};
