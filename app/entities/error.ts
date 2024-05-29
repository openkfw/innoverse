export interface RequestError extends Error {
  info: string;
  status?: number;
  errors?: Error[] | StrapiRequestError[];
}

export interface StrapiRequestError {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details: unknown;
  };
}
