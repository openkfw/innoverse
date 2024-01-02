import { StatusCodes } from 'http-status-codes';
import { ZodType } from 'zod';

export const validateParams = (schema: ZodType, body: any) => {
  const validatedParams = schema.safeParse(body);

  if (!validatedParams.success) {
    return {
      status: StatusCodes.BAD_REQUEST,
      errors: validatedParams.error.flatten().fieldErrors,
    };
  }
  return { status: StatusCodes.OK };
};
