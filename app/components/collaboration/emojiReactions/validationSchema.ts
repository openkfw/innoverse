import { z } from 'zod';

import { ObjectType } from '@/common/types';

export const reactionSchema = z
  .object({
    objectId: z.string(),
    objectType: z.nativeEnum(ObjectType),
    operation: z.string(),
    emoji: z.object({ shortCode: z.string(), nativeSymbol: z.string() }),
  })
  .required();

export const basicSchema = z
  .object({
    objectId: z.string(),
    objectType: z.nativeEnum(ObjectType),
  })
  .required();
