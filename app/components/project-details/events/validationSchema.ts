import { z } from 'zod';

export const eventSchema = z
  .object({
    projectId: z.string(),
  })
  .required();

export const reactionShema = z
  .object({
    eventId: z.string(),
  })
  .required();

export const reactionShemaForEvent = z
  .object({
    eventId: z.string(),
    operation: z.string(),
    emoji: z.object({ shortCode: z.string(), nativeSymbol: z.string() }),
  })
  .required();

export const projectFilterSchema = z
  .object({
    projectId: z.string(),
    amountOfEventsPerPage: z.number(),
    currentPage: z.number(),
    timeframe: z.string(),
  })
  .required();
