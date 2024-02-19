interface ExtendedError extends Error {
  name: string;
  message: string;
  stack?: string;

  resource?: string;
}

export type InnoPlatformError =
  | (ExtendedError & { name: 'StrapiError' })
  | (ExtendedError & { name: 'DatabaseError' })
  | (ExtendedError & { name: 'ValidationError' });

export const strapiError = (context: string, error: Error, resource?: string): InnoPlatformError => ({
  name: 'StrapiError',
  resource,
  message: `Strapi error occurred: ${context}`,
  stack: error.stack,
});

export const dbError = (context: string, error: Error, resource?: string): InnoPlatformError => ({
  name: 'DatabaseError',
  resource,
  message: `Database error occurred: ${context}`,
  stack: error.stack,
});

export const validationError = (context: string, error: Error): InnoPlatformError => ({
  name: 'ValidationError',
  message: `Validation error occurred: ${context}`,
  stack: error.stack,
});
