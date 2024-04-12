import { z } from 'zod';

export const reactionShemaForUpdate = z
  .object({
    updateId: z.string(),
    operation: z.string(),
    emoji: z.object({ shortCode: z.string(), nativeSymbol: z.string() }),
  })
  .required();

export const reactionShemaForEvent = z
  .object({
    eventId: z.string(),
    operation: z.string(),
    emoji: z.object({ shortCode: z.string(), nativeSymbol: z.string() }),
  })
  .required();
