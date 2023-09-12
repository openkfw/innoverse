//@ts-nocheck
import { RequestError } from '../entities/error';

const fetcher = async (...args) => {
  const res = await fetch(...args);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const parsedError: RequestError = await res.json();
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.

    error.info = parsedError.info || 'An error occurred while fetching the data.';
    error.status = parsedError.status || res.status;

    throw error;
  }

  return res.json();
};

export default fetcher;