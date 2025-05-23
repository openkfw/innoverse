import { z } from 'zod';

export const projectFilterSchema = z
  .object({
    projectId: z.string(),
    amountOfEventsPerPage: z.number(),
    currentPage: z.number(),
    timeframe: z.string(),
  })
  .required();
