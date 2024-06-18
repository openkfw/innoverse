import { RequestError } from '@/entities/error';

interface ExtendedError extends Error {
  name: string;
  message: string;
  stack?: string;
  info?: string;
  resource?: string;
}

export type InnoPlatformError =
  | (ExtendedError & { name: 'StrapiError' })
  | (ExtendedError & { name: 'DatabaseError' })
  | (ExtendedError & { name: 'ValidationError' })
  | (ExtendedError & { name: 'RedisError' });

export const strapiError = (context: string, error: RequestError, resource?: string): InnoPlatformError => ({
  name: 'StrapiError',
  resource,
  message: `Strapi error occurred: ${context}`,
  stack: error.stack,
  cause: error.cause,
});

export const dbError = (context: string, error: Error, resource?: string): InnoPlatformError => ({
  name: 'DatabaseError',
  resource,
  message: `Database error occurred: ${context}`,
  stack: error.stack,
  cause: error.cause,
});

export const validationError = (context: string, error: Error): InnoPlatformError => ({
  name: 'ValidationError',
  message: `Validation error occurred: ${context}`,
  stack: error.stack,
  cause: error.cause,
});

export const redisError = (context: string, error?: Error): InnoPlatformError => ({
  name: 'RedisError',
  message: `Redis error occurred: ${context}`,
  stack: error?.stack,
  cause: error?.cause,
});
