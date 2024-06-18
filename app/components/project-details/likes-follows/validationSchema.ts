import { z } from 'zod';

import { ObjectType } from '@/common/types';

export const likeSchema = z
  .object({
    projectId: z.string(),
  })
  .required();

export const followSchema = z
  .object({
    objectId: z.string(),
    objectType: z.nativeEnum(ObjectType),
  })
  .required();
