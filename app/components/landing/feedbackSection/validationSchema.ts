import { z } from 'zod';

export const handleFeedbackSchema = z
  .object({
    feedback: z.string().min(1),
    showOnProjectPage: z.boolean(),
  })
  .required();
