import { z } from 'zod';

export const reactionShema = z
  .object({
    updateId: z.string(),
  })
  .required();

export const reactionShemaForUpdate = z
  .object({
    updateId: z.string(),
    operation: z.string(),
    emoji: z.object({ shortCode: z.string(), nativeSymbol: z.string() }),
  })
  .required();
