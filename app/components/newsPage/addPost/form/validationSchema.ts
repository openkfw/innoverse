import { z } from 'zod';

import { required_field } from '@/common/formValidation';

export const handleUpdateSchema = z.object({
  content: z.string().min(1, required_field),
  project: z.object({ id: z.string().optional(), label: z.string().optional() }).nullable(),
  anonymous: z.boolean(),
});

export const handlePostSchema = z.object({
  content: z.string().min(1, required_field),
  anonymous: z.boolean().optional(),
});

export type UpdateFormValidationSchema = z.infer<typeof handleUpdateSchema>;
export type PostFormValidationSchema = z.infer<typeof handlePostSchema>;
