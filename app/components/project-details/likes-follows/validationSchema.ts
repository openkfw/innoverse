import { z } from 'zod';

export const likeSchema = z
  .object({
    projectId: z.string(),
  })
  .required();

export const followSchema = z
  .object({
    projectId: z.string(),
  })
  .required();
